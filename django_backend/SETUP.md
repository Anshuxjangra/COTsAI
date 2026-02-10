# COTS Part Selection Assistant - Django Backend Setup

## Installation & Setup

### 1. Create Virtual Environment
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Create Django Project
```bash
django-admin startproject cots_backend .
django-admin startapp parts
django-admin startapp api
```

### 4. Run Migrations
```bash
python manage.py migrate
```

### 5. Load Initial Data (Optional)
```bash
python manage.py loaddata components_fixture.json
```

### 6. Create Superuser
```bash
python manage.py createsuperuser
```

### 7. Run Development Server
```bash
python manage.py runserver
```

Server will be available at `http://localhost:8000`

## API Endpoints

- `POST /api/select-parts/` - Select components based on criteria
- `POST /api/download-specs/` - Download component specifications
- `POST /api/download-bom/` - Download Bill of Materials
- `GET /api/components/` - List all components
- `GET /api/components/<component_type>/` - List components by type

## Frontend Configuration

Update React frontend to point to Django backend:

```javascript
const API_BASE_URL = 'http://localhost:8000/api'

// Example fetch
const response = await fetch(`${API_BASE_URL}/select-parts/`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-CSRFToken': csrfToken // Add CSRF token for POST requests
  },
  body: JSON.stringify(formData)
})
```

## CORS Configuration

In `settings.py`, add:
```python
INSTALLED_APPS = [
    ...
    'corsheaders',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    ...
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
```
