# React Frontend Configuration for Django Backend

## Environment Setup

Create a `.env.local` file in your React project root with:

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
```

## API Service Module

Create `lib/api.ts` in your React project:

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api'

// Helper to get CSRF token from cookies
function getCsrfToken() {
  const name = 'csrftoken'
  let cookieValue = null
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';')
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim()
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1))
        break
      }
    }
  }
  return cookieValue
}

export const api = {
  // Component Selection
  async selectParts(formData: Record<string, any>) {
    const response = await fetch(`${API_BASE_URL}/select-parts/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCsrfToken() || '',
      },
      body: JSON.stringify(formData),
    })
    
    if (!response.ok) throw new Error('Failed to select parts')
    return response.json()
  },

  // Get Components List
  async getComponents(componentType?: string) {
    const params = new URLSearchParams()
    if (componentType) params.append('component_type', componentType)
    
    const response = await fetch(
      `${API_BASE_URL}/components/?${params}`,
      {
        headers: { 'Accept': 'application/json' },
      }
    )
    
    if (!response.ok) throw new Error('Failed to fetch components')
    return response.json()
  },

  // Download Specifications
  async downloadSpecs(data: {
    componentId: number
    componentName: string
    manufacturer: string
    specifications: string[]
    criteriaMatches: any[]
    performanceMetrics: any[]
    componentType: string
  }) {
    const response = await fetch(`${API_BASE_URL}/download-specs/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCsrfToken() || '',
      },
      body: JSON.stringify(data),
    })
    
    if (!response.ok) throw new Error('Failed to download specs')
    
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${data.componentName}-specs.csv`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    a.remove()
  },

  // Download BOM
  async downloadBOM(data: {
    projectName: string
    components: any[]
  }) {
    const response = await fetch(`${API_BASE_URL}/download-bom/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCsrfToken() || '',
      },
      body: JSON.stringify(data),
    })
    
    if (!response.ok) throw new Error('Failed to download BOM')
    
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `BOM-${data.projectName}.csv`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    a.remove()
  },

  // Shopping Cart
  async getCart(sessionId: string = 'default') {
    const response = await fetch(
      `${API_BASE_URL}/shopping-cart/?session_id=${sessionId}`,
      {
        headers: { 'Accept': 'application/json' },
      }
    )
    
    if (!response.ok) throw new Error('Failed to fetch cart')
    return response.json()
  },

  async addToCart(data: {
    component_id: number
    name: string
    quantity: number
    price: string
    manufacturer: string
  }, sessionId: string = 'default') {
    const response = await fetch(
      `${API_BASE_URL}/shopping-cart/?session_id=${sessionId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCsrfToken() || '',
        },
        body: JSON.stringify(data),
      }
    )
    
    if (!response.ok) throw new Error('Failed to add to cart')
    return response.json()
  },

  async removeFromCart(componentId: number, sessionId: string = 'default') {
    const response = await fetch(
      `${API_BASE_URL}/shopping-cart/?session_id=${sessionId}&component_id=${componentId}`,
      {
        method: 'DELETE',
        headers: { 'X-CSRFToken': getCsrfToken() || '' },
      }
    )
    
    if (!response.ok) throw new Error('Failed to remove from cart')
    return response.json()
  },
}
```

## Usage Examples

### Select Parts

```typescript
import { api } from '@/lib/api'

const handleSelectParts = async (formData) => {
  try {
    const response = await api.selectParts({
      componentType: 'bearing',
      dynamicLoad: 25,
      speed: 5000,
      boreSize: 40,
      bearingEnvironment: 'Clean/Sealed',
      lubrication: 'Grease',
      bearingMaterial: 'Steel',
    })
    
    console.log('Top recommendations:', response.recommendations)
  } catch (error) {
    console.error('Error:', error)
  }
}
```

### Download Specifications

```typescript
const handleDownloadSpecs = async (component) => {
  try {
    await api.downloadSpecs({
      componentId: component.id,
      componentName: component.name,
      manufacturer: component.manufacturer,
      specifications: component.specifications,
      criteriaMatches: component.criteriaMatches,
      performanceMetrics: component.performanceMetrics,
      componentType: component.componentType,
    })
  } catch (error) {
    console.error('Download failed:', error)
  }
}
```

### Shopping Cart

```typescript
const handleAddToCart = async (component) => {
  try {
    await api.addToCart({
      component_id: component.id,
      name: component.name,
      quantity: 1,
      price: component.price,
      manufacturer: component.manufacturer,
    })
  } catch (error) {
    console.error('Failed to add to cart:', error)
  }
}
```

## CORS Configuration

The Django backend is configured with CORS to accept requests from:
- `http://localhost:3000`
- `http://127.0.0.1:3000`
- `http://localhost:8000`

To add more origins, update `CORS_ALLOWED_ORIGINS` in `cots_backend/settings.py`

## Testing the Integration

1. Start Django backend:
```bash
python manage.py runserver
```

2. Start React frontend:
```bash
npm run dev
```

3. Navigate to `http://localhost:3000/selector` and test the component selection
