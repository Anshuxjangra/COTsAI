# COTS Part Selection Assistant - React Frontend Code

## Project Setup

### 1. package.json
```json
{
  "name": "cots-part-selector",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "axios": "^1.6.0",
    "react-router-dom": "^6.20.0",
    "tailwindcss": "^3.3.0",
    "shadcn-ui": "^0.8.0",
    "@radix-ui/react-dialog": "^1.1.1",
    "@radix-ui/react-dropdown-menu": "^2.0.5",
    "lucide-react": "^0.293.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}
```

### 2. .env
```
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_BACKEND_URL=http://localhost:8000
```

---

## Frontend Components

### 3. src/index.js
```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### 4. src/App.js
```javascript
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import SelectorPage from './pages/SelectorPage';
import DemoPage from './pages/DemoPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/selector" element={<SelectorPage />} />
            <Route path="/demo" element={<DemoPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
```

### 5. src/api/client.js
```javascript
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for auth token if needed
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('[v0] API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default apiClient;
```

### 6. src/api/partService.js
```javascript
import apiClient from './client';

const partService = {
  // Get all components
  getAllComponents: async () => {
    const response = await apiClient.get('/components/');
    return response.data;
  },

  // Get component by ID
  getComponentById: async (id) => {
    const response = await apiClient.get(`/components/${id}/`);
    return response.data;
  },

  // Search components by type
  getComponentsByType: async (componentType) => {
    const response = await apiClient.get('/components/', {
      params: { component_type: componentType },
    });
    return response.data;
  },

  // Select parts based on requirements
  selectParts: async (requirements) => {
    const response = await apiClient.post('/select-parts/', requirements);
    return response.data;
  },

  // Download component specs
  downloadSpecs: async (componentId) => {
    const response = await apiClient.get('/download-specs/', {
      params: { component_id: componentId },
      responseType: 'blob',
    });
    return response.data;
  },

  // Download BOM
  downloadBOM: async (cartItems) => {
    const response = await apiClient.post('/download-bom/', 
      { items: cartItems },
      { responseType: 'blob' }
    );
    return response.data;
  },

  // Cart operations
  addToCart: async (componentId, quantity = 1) => {
    const response = await apiClient.post('/shopping-cart/add/', {
      component_id: componentId,
      quantity,
    });
    return response.data;
  },

  getCart: async () => {
    const response = await apiClient.get('/shopping-cart/');
    return response.data;
  },

  removeFromCart: async (cartItemId) => {
    const response = await apiClient.delete(`/shopping-cart/${cartItemId}/`);
    return response.data;
  },

  updateCartQuantity: async (cartItemId, quantity) => {
    const response = await apiClient.patch(`/shopping-cart/${cartItemId}/`, {
      quantity,
    });
    return response.data;
  },

  clearCart: async () => {
    const response = await apiClient.post('/shopping-cart/clear/');
    return response.data;
  },
};

export default partService;
```

### 7. src/components/Header.js
```javascript
import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

function Header() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="text-xl font-bold text-gray-900">COTS Selector</span>
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium">
              Home
            </Link>
            <Link to="/selector" className="text-gray-700 hover:text-blue-600 font-medium">
              Selector
            </Link>
            <Link to="/demo" className="text-gray-700 hover:text-blue-600 font-medium">
              Demo
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-md"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <nav className="md:hidden pb-4 space-y-2">
            <Link
              to="/"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
            >
              Home
            </Link>
            <Link
              to="/selector"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
            >
              Selector
            </Link>
            <Link
              to="/demo"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
            >
              Demo
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}

export default Header;
```

### 8. src/components/Footer.js
```javascript
import React from 'react';
import { Github, Linkedin, Twitter } from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-lg mb-4">COTS Selector</h3>
            <p className="text-gray-400">
              Intelligent component selection for engineers
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">Features</a></li>
              <li><a href="#" className="hover:text-white">Pricing</a></li>
              <li><a href="#" className="hover:text-white">Documentation</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">About</a></li>
              <li><a href="#" className="hover:text-white">Blog</a></li>
              <li><a href="#" className="hover:text-white">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-blue-400"><Github size={20} /></a>
              <a href="#" className="hover:text-blue-400"><Linkedin size={20} /></a>
              <a href="#" className="hover:text-blue-400"><Twitter size={20} /></a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>&copy; 2024 COTS Part Selection Assistant. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
```

### 9. src/components/PartSelector.js
```javascript
import React, { useState } from 'react';
import { ChevronRight, ShoppingCart, Download } from 'lucide-react';
import partService from '../api/partService';
import CriteriaMatching from './CriteriaMatching';
import ShoppingCart from './ShoppingCart';

const PartSelector = () => {
  const [step, setStep] = useState(1);
  const [componentType, setComponentType] = useState('bearing');
  const [requirements, setRequirements] = useState({});
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [cart, setCart] = useState([]);

  const componentTypes = ['bearing', 'motor', 'gear', 'seal', 'fastener'];

  const getRequirementFields = () => {
    const fieldsByType = {
      bearing: {
        designParams: ['Dynamic Load (N)', 'Speed (RPM)', 'Bore Size (mm)', 'L10 Life (hours)'],
        environmental: ['Operating Environment', 'Lubrication Type', 'Relubrication Interval'],
        material: ['Bearing Material', 'Cage Material', 'Seal Type'],
      },
      motor: {
        designParams: ['Power Output (kW)', 'Speed (RPM)', 'Poles', 'Duty Class'],
        environmental: ['Ambient Temperature (°C)', 'Mounting Position', 'Cooling Type'],
        material: ['Frame Material', 'Insulation Class', 'Efficiency Class'],
      },
      gear: {
        designParams: ['Power (kW)', 'Input Speed (RPM)', 'Gear Ratio', 'Module (mm)'],
        environmental: ['Noise Level', 'Oil Type', 'Vibration Level'],
        material: ['Gear Material', 'Shaft Material', 'Surface Treatment'],
      },
      seal: {
        designParams: ['Seal Diameter (mm)', 'Shaft Speed (RPM)', 'Pressure (bar)', 'Gland Type'],
        environmental: ['Sealing Medium', 'Fluid Temperature (°C)', 'pH Level'],
        material: ['Elastomer Type', 'Spring Material', 'Face Material'],
      },
      fastener: {
        designParams: ['Diameter (mm)', 'Thread Pitch (mm)', 'Clamp Load (N)', 'Preload (%)'],
        environmental: ['Operating Temperature (°C)', 'Loading Type', 'Cycle Count'],
        material: ['Material Grade', 'Surface Treatment', 'Anti-seize'],
      },
    };
    return fieldsByType[componentType] || {};
  };

  const handleRequirementChange = (field, value) => {
    setRequirements({
      ...requirements,
      [field]: value,
    });
    console.log('[v0] Updated requirement:', field, value);
  };

  const handleSelectParts = async () => {
    setLoading(true);
    try {
      const payload = {
        component_type: componentType,
        requirements,
      };
      console.log('[v0] Selecting parts with payload:', payload);
      
      const response = await partService.selectParts(payload);
      setResults(response);
      setStep(4);
      console.log('[v0] Parts selected successfully:', response);
    } catch (error) {
      console.error('[v0] Error selecting parts:', error);
      alert('Error selecting parts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (componentId) => {
    try {
      await partService.addToCart(componentId, 1);
      const updatedCart = await partService.getCart();
      setCart(updatedCart);
      console.log('[v0] Added to cart, cart updated:', updatedCart);
    } catch (error) {
      console.error('[v0] Error adding to cart:', error);
    }
  };

  const handleDownloadSpecs = async (componentId) => {
    try {
      const blob = await partService.downloadSpecs(componentId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `component-${componentId}-specs.csv`;
      a.click();
      console.log('[v0] Downloaded specs for component:', componentId);
    } catch (error) {
      console.error('[v0] Error downloading specs:', error);
    }
  };

  const fields = getRequirementFields();

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Step Indicator */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-4">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center flex-1">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${
                  step >= s
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}
              >
                {s}
              </div>
              {s < 4 && (
                <div
                  className={`flex-1 h-1 mx-2 ${
                    step > s ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Component Type</span>
          <span>Parameters</span>
          <span>Analysis</span>
          <span>Results</span>
        </div>
      </div>

      {/* Step 1: Component Type Selection */}
      {step === 1 && (
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold mb-6">Select Component Type</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {componentTypes.map((type) => (
              <button
                key={type}
                onClick={() => {
                  setComponentType(type);
                  setStep(2);
                }}
                className={`p-4 rounded-lg border-2 font-semibold capitalize transition ${
                  componentType === type
                    ? 'border-blue-600 bg-blue-50 text-blue-600'
                    : 'border-gray-300 text-gray-700 hover:border-blue-400'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
          <button
            onClick={() => setStep(2)}
            className="mt-8 w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
          >
            Continue <ChevronRight className="inline ml-2" size={20} />
          </button>
        </div>
      )}

      {/* Step 2: Requirements Input */}
      {step === 2 && (
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold mb-6 capitalize">
            {componentType} Requirements
          </h2>

          {/* Design Parameters */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Design Parameters</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fields.designParams?.map((param) => (
                <input
                  key={param}
                  type="text"
                  placeholder={param}
                  value={requirements[param] || ''}
                  onChange={(e) => handleRequirementChange(param, e.target.value)}
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              ))}
            </div>
          </div>

          {/* Environmental Requirements */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Environmental Requirements</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fields.environmental?.map((param) => (
                <input
                  key={param}
                  type="text"
                  placeholder={param}
                  value={requirements[param] || ''}
                  onChange={(e) => handleRequirementChange(param, e.target.value)}
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              ))}
            </div>
          </div>

          {/* Material Requirements */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Material Requirements</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fields.material?.map((param) => (
                <input
                  key={param}
                  type="text"
                  placeholder={param}
                  value={requirements[param] || ''}
                  onChange={(e) => handleRequirementChange(param, e.target.value)}
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setStep(1)}
              className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400"
            >
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Analysis */}
      {step === 3 && (
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold mb-6">Analyzing Requirements</h2>
          <p className="text-gray-600 mb-6">
            Your specifications are being matched against our component database...
          </p>
          <button
            onClick={handleSelectParts}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Analyzing...' : 'Find Matching Components'}
          </button>
        </div>
      )}

      {/* Step 4: Results */}
      {step === 4 && results && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-8">
            <h2 className="text-2xl font-bold mb-6">Matched Components</h2>
            
            {/* Top 1 Recommendation */}
            {results.recommendations && results.recommendations[0] && (
              <div className="mb-8 p-6 border-2 border-green-500 rounded-lg bg-green-50">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-green-700">
                      Top 1 Recommended: {results.recommendations[0].name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Part: {results.recommendations[0].part_number} | 
                      Manufacturer: {results.recommendations[0].manufacturer}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">
                      {results.recommendations[0].matchScore}%
                    </p>
                    <p className="text-sm text-gray-600">Match Score</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="bg-white p-3 rounded">
                    <p className="text-sm text-gray-600">Price</p>
                    <p className="font-bold">${results.recommendations[0].price}</p>
                  </div>
                  <div className="bg-white p-3 rounded">
                    <p className="text-sm text-gray-600">Availability</p>
                    <p className="font-bold">{results.recommendations[0].availability}</p>
                  </div>
                  <div className="bg-white p-3 rounded">
                    <p className="text-sm text-gray-600">Lead Time</p>
                    <p className="font-bold">{results.recommendations[0].lead_time}</p>
                  </div>
                  <div className="bg-white p-3 rounded">
                    <p className="text-sm text-gray-600">Rating</p>
                    <p className="font-bold">{results.recommendations[0].rating}/5</p>
                  </div>
                </div>

                <div className="flex gap-3 flex-wrap">
                  <button
                    onClick={() => window.open(results.recommendations[0].vendor_url, '_blank')}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-semibold"
                  >
                    Buy Now
                  </button>
                  <button
                    onClick={() => handleAddToCart(results.recommendations[0].id)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-semibold flex items-center gap-2"
                  >
                    <ShoppingCart size={18} /> Add to Cart
                  </button>
                  <button
                    onClick={() => handleDownloadSpecs(results.recommendations[0].id)}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 font-semibold flex items-center gap-2"
                  >
                    <Download size={18} /> Specs
                  </button>
                </div>
              </div>
            )}

            {/* Criteria Matching */}
            {results.criteria_matches && (
              <CriteriaMatching criteriaMatches={results.criteria_matches} />
            )}

            {/* Other Recommendations */}
            {results.recommendations && results.recommendations.slice(1).length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-bold mb-4">Alternative Options</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.recommendations.slice(1).map((component, index) => (
                    <div key={component.id} className="border rounded-lg p-4 hover:shadow-lg transition">
                      <div className="flex justify-between mb-2">
                        <h4 className="font-semibold">{component.name}</h4>
                        <span className="text-blue-600 font-bold">{component.matchScore}%</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{component.part_number}</p>
                      <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                        <div><p className="text-gray-600">Price: ${component.price}</p></div>
                        <div><p className="text-gray-600">Stock: {component.availability}</p></div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => window.open(component.vendor_url, '_blank')}
                          className="flex-1 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                        >
                          Buy
                        </button>
                        <button
                          onClick={() => handleAddToCart(component.id)}
                          className="flex-1 bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
                        >
                          Cart
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setStep(2)}
              className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400"
            >
              Modify Requirements
            </button>
            <button
              onClick={() => setShowCart(true)}
              className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 flex items-center justify-center gap-2"
            >
              <ShoppingCart size={20} /> View Cart
            </button>
          </div>
        </div>
      )}

      {/* Shopping Cart Modal */}
      {showCart && (
        <ShoppingCart
          isOpen={showCart}
          onClose={() => setShowCart(false)}
          cart={cart}
        />
      )}
    </div>
  );
};

export default PartSelector;
```

### 10. src/components/CriteriaMatching.js
```javascript
import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';

const CriteriaMatching = ({ criteriaMatches }) => {
  const getCategoryColor = (category) => {
    const colors = {
      critical: 'border-red-300 bg-red-50',
      high: 'border-yellow-300 bg-yellow-50',
      medium: 'border-blue-300 bg-blue-50',
      low: 'border-green-300 bg-green-50',
    };
    return colors[category] || 'border-gray-300 bg-gray-50';
  };

  const getCategoryBadgeColor = (category) => {
    const colors = {
      critical: 'bg-red-500',
      high: 'bg-yellow-500',
      medium: 'bg-blue-500',
      low: 'bg-green-500',
    };
    return colors[category] || 'bg-gray-500';
  };

  const categories = ['critical', 'high', 'medium', 'low'];

  return (
    <div className="mt-8">
      <h3 className="text-lg font-bold mb-4">Criteria Matching Analysis</h3>
      <div className="space-y-4">
        {categories.map((category) => {
          const items = criteriaMatches?.[category] || [];
          if (items.length === 0) return null;

          return (
            <div key={category} className={`border rounded-lg p-4 ${getCategoryColor(category)}`}>
              <div className="flex items-center mb-3">
                <span className={`${getCategoryBadgeColor(category)} text-white px-3 py-1 rounded-full text-sm font-semibold capitalize`}>
                  {category} Priority
                </span>
              </div>
              <div className="space-y-2">
                {items.map((item, index) => (
                  <div key={index} className="flex items-start gap-3 text-sm">
                    {item.status === 'met' ? (
                      <CheckCircle size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle size={18} className="text-orange-600 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className="font-semibold">{item.criteria}</p>
                      <p className="text-gray-600">{item.description}</p>
                      {item.actual && item.required && (
                        <p className="text-xs text-gray-500 mt-1">
                          Required: {item.required} | Actual: {item.actual}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CriteriaMatching;
```

### 11. src/components/ShoppingCart.js
```javascript
import React, { useState, useEffect } from 'react';
import { X, Trash2, Download } from 'lucide-react';
import partService from '../api/partService';

const ShoppingCart = ({ isOpen, onClose, cart: initialCart }) => {
  const [cart, setCart] = useState(initialCart || []);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadCart();
    }
  }, [isOpen]);

  const loadCart = async () => {
    try {
      const cartData = await partService.getCart();
      setCart(cartData);
      console.log('[v0] Cart loaded:', cartData);
    } catch (error) {
      console.error('[v0] Error loading cart:', error);
    }
  };

  const handleRemoveFromCart = async (cartItemId) => {
    try {
      await partService.removeFromCart(cartItemId);
      loadCart();
      console.log('[v0] Removed item from cart');
    } catch (error) {
      console.error('[v0] Error removing item:', error);
    }
  };

  const handleDownloadBOM = async () => {
    setLoading(true);
    try {
      const blob = await partService.downloadBOM(cart);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `BOM-${new Date().getTime()}.csv`;
      a.click();
      console.log('[v0] Downloaded BOM');
    } catch (error) {
      console.error('[v0] Error downloading BOM:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Cart is empty');
      return;
    }
    alert('Redirecting to checkout...');
    console.log('[v0] Checkout initiated with items:', cart);
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity || 0), 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end md:items-center justify-end md:justify-center">
      <div className="bg-white w-full md:w-96 max-h-screen md:max-h-96 rounded-t-lg md:rounded-lg shadow-xl overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">Shopping Cart</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-4">
          {cart.length === 0 ? (
            <p className="text-gray-600 text-center py-8">Your cart is empty</p>
          ) : (
            <>
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.id} className="border rounded-lg p-3 flex gap-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{item.component_name}</h4>
                      <p className="text-xs text-gray-600">{item.part_number}</p>
                      <p className="text-sm font-bold text-blue-600 mt-1">
                        ${item.price} x {item.quantity}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemoveFromCart(item.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 mb-4">
                <div className="flex justify-between mb-4">
                  <span className="font-semibold">Total:</span>
                  <span className="text-2xl font-bold text-blue-600">${total.toFixed(2)}</span>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={handleDownloadBOM}
                    disabled={loading}
                    className="w-full bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Download size={16} /> Download BOM
                  </button>
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 font-semibold text-sm"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;
```

### 12. src/pages/HomePage.js
```javascript
import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Database, TrendingUp, Shield } from 'lucide-react';

function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Find the Perfect COTS Component</h1>
          <p className="text-xl mb-8 text-blue-100">
            Intelligent component selection powered by AI and engineering expertise
          </p>
          <Link
            to="/selector"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-blue-50"
          >
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Why Choose COTS Selector?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Zap size={32} />,
                title: 'Lightning Fast',
                description: 'Get component recommendations in seconds'
              },
              {
                icon: <Database size={32} />,
                title: 'Vast Database',
                description: '100,000+ components from top vendors'
              },
              {
                icon: <TrendingUp size={32} />,
                title: 'Smart Matching',
                description: 'AI-powered criteria evaluation'
              },
              {
                icon: <Shield size={32} />,
                title: 'Certified Quality',
                description: 'All components meet engineering standards'
              }
            ].map((feature, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
                <div className="text-blue-600 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your Perfect Component?</h2>
          <p className="text-lg mb-8">Start your component selection journey today</p>
          <Link
            to="/selector"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-blue-50"
          >
            Open Selector Tool
          </Link>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
```

### 13. src/pages/SelectorPage.js
```javascript
import React from 'react';
import PartSelector from '../components/PartSelector';

function SelectorPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <PartSelector />
    </div>
  );
}

export default SelectorPage;
```

### 14. src/pages/DemoPage.js
```javascript
import React from 'react';
import { ChevronRight } from 'lucide-react';

function DemoPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-12 text-center">How It Works</h1>

      <div className="space-y-8">
        {[
          {
            step: 1,
            title: 'Select Component Type',
            description: 'Choose from bearings, motors, gears, seals, or fasteners'
          },
          {
            step: 2,
            title: 'Define Requirements',
            description: 'Specify design parameters, environmental, and material requirements'
          },
          {
            step: 3,
            title: 'AI Analysis',
            description: 'Our system analyzes 100,000+ components against your specs'
          },
          {
            step: 4,
            title: 'Get Recommendations',
            description: 'Receive ranked components with detailed specs and vendor links'
          },
          {
            step: 5,
            title: 'Download & Order',
            description: 'Get datasheets, BOM, and buy directly from vendors'
          }
        ].map((item) => (
          <div key={item.step} className="flex gap-6">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-600 text-white font-bold text-lg">
                {item.step}
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
            </div>
            {item.step < 5 && (
              <div className="hidden md:flex items-center text-blue-600">
                <ChevronRight size={24} />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-12 bg-blue-50 p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Key Features</h2>
        <ul className="space-y-3 text-gray-700">
          <li>✓ Component-specific input fields for precise matching</li>
          <li>✓ Criteria evaluation across critical, high, and medium priorities</li>
          <li>✓ Real-time price and availability checking</li>
          <li>✓ Download detailed specifications and datasheets</li>
          <li>✓ Shopping cart for managing multiple components</li>
          <li>✓ Direct vendor links for ordering</li>
        </ul>
      </div>
    </div>
  );
}

export default DemoPage;
```

### 15. src/index.css
```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --primary: #2563eb;
  --primary-dark: #1d4ed8;
  --secondary: #64748b;
  --background: #ffffff;
  --foreground: #1f2937;
  --border: #e5e7eb;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: var(--background);
  color: var(--foreground);
}

.container {
  max-width: 1280px;
  margin: 0 auto;
}
```

---

## Installation Instructions

1. Create React app:
```bash
npx create-react-app cots-part-selector
cd cots-part-selector
```

2. Install dependencies:
```bash
npm install axios react-router-dom tailwindcss lucide-react
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

3. Copy all component files to `src/`

4. Create `.env` file with backend URL

5. Start the app:
```bash
npm start
```

---

## API Endpoints Expected from Django Backend

- `GET /api/components/` - Get all components
- `GET /api/components/{id}/` - Get component details
- `POST /api/select-parts/` - Select matching parts
- `GET /api/download-specs/` - Download component specs
- `POST /api/download-bom/` - Download BOM
- `POST /api/shopping-cart/add/` - Add to cart
- `GET /api/shopping-cart/` - Get cart
- `DELETE /api/shopping-cart/{id}/` - Remove from cart
- `POST /api/shopping-cart/clear/` - Clear cart
