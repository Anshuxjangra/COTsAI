# COTS Part Selection Assistant - Django Backend

A powerful Django REST API backend for intelligent COTS (Commercial Off-The-Shelf) component selection system. The backend handles component database management, engineering criteria matching, and provides APIs for React frontend integration.

## Features

- **Component Database**: Manage bearings, motors, gears, seals, and fasteners
- **Intelligent Matching**: Evaluate components against engineering requirements
- **Criteria Evaluation**: Component-specific design, environmental, and material requirements
- **Performance Metrics**: Detailed performance analysis for each component
- **Bill of Materials**: Generate BOM exports
- **Specifications Download**: Export detailed component specifications
- **Shopping Cart**: Manage selected components
- **Admin Interface**: Django admin for component and specification management

## Project Structure

```
django_backend/
├── cots_backend/           # Django project settings
│   ├── settings.py         # Project settings and configuration
│   ├── urls.py             # Main URL routing
│   └── wsgi.py             # WSGI application
├── parts/                  # Core components app
│   ├── models.py           # Component, Specification, SelectionHistory models
│   ├── admin.py            # Django admin configuration
│   └── apps.py             # App configuration
├── api/                    # REST API app
│   ├── views.py            # API endpoints
│   ├── serializers.py      # DRF serializers
│   ├── criteria_engine.py  # Component evaluation logic
│   └── download_handler.py # CSV generation
├── manage.py               # Django management script
├── requirements.txt        # Python dependencies
├── SETUP.md                # Setup instructions
└── README.md               # This file
```

## Quick Start

### Prerequisites
- Python 3.8+
- pip
- Virtual environment

### Installation

1. **Clone the repository and navigate to backend directory**
```bash
cd django_backend
```

2. **Create and activate virtual environment**
```bash
python -m venv venv

# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Create Django apps (if not already created)**
```bash
cd ..
django-admin startproject cots_backend django_backend
cd django_backend
python manage.py startapp parts
python manage.py startapp api
```

5. **Apply migrations**
```bash
python manage.py migrate
```

6. **Create superuser**
```bash
python manage.py createsuperuser
```

7. **Run development server**
```bash
python manage.py runserver
```

Server will be available at `http://localhost:8000`
Admin panel: `http://localhost:8000/admin`

## API Endpoints

### Component Selection
```
POST /api/select-parts/
```
Select components based on engineering requirements.

**Request:**
```json
{
  "componentType": "bearing",
  "dynamicLoad": 25,
  "speed": 5000,
  "boreSize": 40,
  "bearingEnvironment": "Clean/Sealed",
  "lubrication": "Grease",
  "bearingMaterial": "Steel",
  "targetL10Life": 20000
}
```

**Response:**
```json
{
  "recommendations": [
    {
      "id": 1,
      "name": "Deep Groove Ball Bearing 6008",
      "manufacturer": "SKF",
      "matchScore": 95,
      "criteriaMatches": [...],
      "performanceMetrics": [...],
      ...
    }
  ],
  "totalMatches": 3
}
```

### List Components
```
GET /api/components/
GET /api/components/?component_type=bearing
GET /api/components/?manufacturer=SKF&ordering=-rating
```

Query parameters:
- `component_type`: bearing, motor, gear, seal, fastener
- `manufacturer`: Filter by manufacturer
- `search`: Search by name or part number
- `ordering`: -rating (default), created_at, -created_at

### Download Specifications
```
POST /api/download-specs/
```

**Request:**
```json
{
  "componentId": 1,
  "componentName": "Deep Groove Ball Bearing 6008",
  "manufacturer": "SKF",
  "specifications": [...],
  "criteriaMatches": [...],
  "performanceMetrics": [...],
  "componentType": "bearing"
}
```

**Response:** CSV file download

### Download Bill of Materials
```
POST /api/download-bom/
```

**Request:**
```json
{
  "projectName": "My Project",
  "components": [
    {
      "id": 1,
      "name": "Deep Groove Ball Bearing 6008",
      "manufacturer": "SKF",
      "partNumber": "6008",
      "quantity": 2,
      "price": "$25-35",
      "availability": "In Stock",
      "leadTime": "2-3 weeks",
      "vendorUrl": "https://..."
    }
  ]
}
```

**Response:** BOM CSV file download

### Shopping Cart
```
GET /api/shopping-cart/?session_id=user123
POST /api/shopping-cart/?session_id=user123
DELETE /api/shopping-cart/?session_id=user123&component_id=1
```

## Database Models

### Component
Main component record with basic information and specifications.

**Fields:**
- `component_type`: bearing, motor, gear, seal, fastener
- `name`: Component name
- `manufacturer`: Manufacturer name
- `part_number`: Unique part number (indexed)
- `price`: Price range (e.g., "$25-35")
- `availability`: Stock status
- `lead_time`: Delivery time
- `rating`: 0-5 star rating
- `specifications`: JSON list of specifications
- `pros`: JSON list of advantages
- `cons`: JSON list of disadvantages
- `alternatives`: JSON list of alternative components
- `vendor_url`: Direct vendor link

### ComponentSpecification
Detailed specifications for each component type.

**Fields (component-type specific):**
- **Bearing**: bore_diameter, outer_diameter, dynamic_load_rating, speed_rating, l10_life
- **Motor**: power, speed, voltage, efficiency, insulation_class, frame_size
- **Gear**: module, gear_material, power_transmission, precision_grade, face_width
- **Seal**: seal_diameter, pressure_rating, temp_min, temp_max, elastomer_type
- **Fastener**: fastener_diameter, clamp_load_capacity, material_grade, tensile_strength

### SelectionHistory
Track component selections for analytics.

**Fields:**
- `component_type`: Type of component selected
- `form_data`: JSON of user input
- `selected_component`: FK to Component
- `match_score`: Matching percentage (0-100)
- `criteria_matches`: JSON of evaluation results
- `created_at`: Timestamp

### Cart
Shopping cart for tracking selected components.

**Fields:**
- `session_id`: Unique session identifier
- `components`: JSON list of cart items
- `created_at`: Cart creation timestamp
- `updated_at`: Last modification timestamp

## Criteria Matching Engine

Component selection is based on component-specific criteria evaluation:

### Bearing Criteria
- Dynamic Load Capacity (critical)
- Speed Rating (critical)
- L10 Life (critical)
- Bore Size (high)
- Environmental Compatibility (high)
- Lubrication Type (medium)
- Material Availability (medium)

### Motor Criteria
- Power Output (critical)
- Speed Rating (critical)
- Duty Class Support (high)
- Insulation Class (high)
- Environmental Tolerance (high)
- Energy Efficiency (medium)

### Gear Criteria
- Power Transmission (critical)
- Module Size (critical)
- Material Compatibility (high)
- Precision Grade (high)
- Lubrication Compatibility (medium)

### Seal Criteria
- Seal Diameter (critical)
- Pressure Rating (critical)
- Sealing Medium Compatibility (critical)
- Elastomer Type (high)
- Temperature Range (high)

### Fastener Criteria
- Fastener Diameter (critical)
- Clamp Load Capacity (critical)
- Material Grade (critical)
- Environmental Suitability (high)
- Temperature Tolerance (high)

## Loading Sample Data

Create a Django fixture with sample components:

```bash
# Create sample data
python manage.py shell
```

```python
from parts.models import Component, ComponentSpecification

# Create a bearing
bearing = Component.objects.create(
    component_type='bearing',
    name='Deep Groove Ball Bearing 6008',
    manufacturer='SKF',
    part_number='SKF-6008',
    price='$25-35',
    availability='In Stock',
    lead_time='2-3 weeks',
    rating=4.8,
    specifications=[
        'Bore diameter: 40mm',
        'Outer diameter: 68mm',
        'Dynamic load rating: 28.9 kN',
        'Speed rating: 10,000 RPM',
    ],
    pros=['High-speed capability', 'Low friction'],
    cons=['Not suitable for extreme vibration'],
    vendor_url='https://www.skf.com'
)

# Create specification
ComponentSpecification.objects.create(
    component=bearing,
    bore_diameter=40,
    outer_diameter=68,
    dynamic_load_rating=28.9,
    speed_rating=10000,
    l10_life=25000,
)
```

## Integration with React Frontend

See `REACT_FRONTEND_CONFIG.md` for detailed React integration instructions.

### Quick Integration Steps:

1. **Add API configuration to React project:**
   - Copy the API service code from REACT_FRONTEND_CONFIG.md
   - Create `lib/api.ts` in React project

2. **Update environment:**
   ```
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
   ```

3. **Use API in components:**
   ```typescript
   import { api } from '@/lib/api'
   
   const recommendations = await api.selectParts(formData)
   ```

## Deployment

### Production Settings

Update `settings.py` for production:

```python
DEBUG = False
ALLOWED_HOSTS = ['yourdomain.com', 'www.yourdomain.com']
SECRET_KEY = 'your-secret-key-here'  # Use environment variable

# CORS for production
CORS_ALLOWED_ORIGINS = [
    "https://yourdomain.com",
    "https://www.yourdomain.com",
]

# Database (use PostgreSQL for production)
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'cots_db',
        'USER': 'postgres',
        'PASSWORD': 'your-password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

### Running with Gunicorn

```bash
pip install gunicorn
gunicorn cots_backend.wsgi:application --bind 0.0.0.0:8000
```

## Testing

Run tests with:
```bash
python manage.py test
```

## Troubleshooting

### CORS Issues
- Ensure React app URL is in `CORS_ALLOWED_ORIGINS` in settings.py
- Check browser console for CORS error messages
- Verify API_BASE_URL is correct in React .env file

### Database Errors
- Run migrations: `python manage.py migrate`
- Check database connection in settings.py
- Verify database is running (for PostgreSQL)

### Component Not Found
- Ensure components are loaded into database
- Check component_type spelling matches your filter
- Use Django admin to verify components exist

## License

MIT License

## Support

For issues and questions, please refer to the API documentation or create an issue in the repository.
