# LearnHub API Documentation

Complete API reference for developers integrating with LearnHub backend.

## Base URL

```
Development:
- Node.js: http://localhost:5000/api
- Python: http://localhost:5001/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### 1. Register User
**POST** `/api/register`

Create a new user account.

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "user_id": 1
}
```

**Errors:**
- `400`: Missing required fields
- `400`: Email or username already exists

---

### 2. Login
**POST** `/api/login`

Authenticate user and get JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "study_goal": null
  }
}
```

**Errors:**
- `400`: Email and password required
- `401`: Invalid credentials

---

### 3. Get Current User
**GET** `/api/user`

Get authenticated user's profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "study_goal": "Learn Python for Data Science",
  "created_at": "2024-01-15T10:30:00"
}
```

**Errors:**
- `401`: No token provided
- `403`: Invalid token
- `404`: User not found

---

### 4. Update Study Goal
**PUT** `/api/user/study-goal`

Update user's overall study goal.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "study_goal": "Master machine learning by Q4 2024"
}
```

**Response (200):**
```json
{
  "message": "Study goal updated successfully"
}
```

---

## Document Endpoints

### 5. Upload Document
**POST** `/api/documents/upload`

Upload a new document for learning.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Form Data:**
- `document` (file, required) - File to upload
- `document_title` (string, optional) - Custom document title

**Supported Formats:** PDF, DOC, DOCX, TXT, PPT, PPTX, JPG, PNG

**Response (201):**
```json
{
  "message": "Document uploaded successfully",
  "document": {
    "id": 5,
    "filename": "Python_Guide.pdf",
    "file_size": 2048576,
    "upload_date": "2024-01-20T14:22:00"
  }
}
```

**Errors:**
- `400`: No file provided
- `400`: File type not allowed
- `413`: File too large (max 50MB)

---

### 6. Get User's Documents
**GET** `/api/documents`

List all documents uploaded by the user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "id": 1,
    "filename": "Python_Basics.pdf",
    "file_size": 1024000,
    "upload_date": "2024-01-15T10:30:00",
    "progress_percentage": 45,
    "completion_percentage": 45
  },
  {
    "id": 2,
    "filename": "Data_Science.docx",
    "file_size": 512000,
    "upload_date": "2024-01-20T14:22:00",
    "progress_percentage": 0,
    "completion_percentage": 0
  }
]
```

---

### 7. Delete Document
**DELETE** `/api/documents/<id>`

Delete a document and all associated data.

**Parameters:**
- `id` (integer, required) - Document ID

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Document deleted successfully"
}
```

**Errors:**
- `404`: Document not found

---

## Progress Tracking Endpoints

### 8. Update Progress
**PUT** `/api/progress/<doc_id>`

Update learning progress for a specific document.

**Parameters:**
- `doc_id` (integer, required) - Document ID

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "pages_read": 50,
  "total_pages": 100
}
```

**Response (200):**
```json
{
  "message": "Progress updated",
  "completion_percentage": 50
}
```

---

### 9. Get Progress
**GET** `/api/progress/<doc_id>`

Get progress details for a specific document.

**Parameters:**
- `doc_id` (integer, required) - Document ID

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "id": 1,
  "pages_read": 50,
  "total_pages": 100,
  "completion_percentage": 50,
  "last_accessed": "2024-01-20T15:00:00"
}
```

---

### 10. Get User Statistics
**GET** `/api/stats`

Get overall learning statistics.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "total_documents": 5,
  "total_notes": 12,
  "avg_progress": 42.5
}
```

---

## Study Preferences Endpoints

### 11. Create Study Preference
**POST** `/api/study-preferences`

Save user's learning preferences.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "subject": "Python Programming",
  "learning_style": "visual",
  "time_per_session": 45
}
```

**Valid Learning Styles:**
- `visual` - Videos, images, diagrams
- `auditory` - Lectures, discussions
- `reading` - Books, notes
- `kinesthetic` - Hands-on, experiments
- `mixed` - Combination

**Response (201):**
```json
{
  "message": "Study preferences saved",
  "id": 3
}
```

---

### 12. Get Study Preferences
**GET** `/api/study-preferences`

Retrieve all study preferences for the user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "id": 1,
    "subject": "Python Programming",
    "learning_style": "visual",
    "time_per_session": 45,
    "created_at": "2024-01-20T14:00:00"
  },
  {
    "id": 2,
    "subject": "Data Science",
    "learning_style": "kinesthetic",
    "time_per_session": 60,
    "created_at": "2024-01-22T09:30:00"
  }
]
```

---

## Health Check

### 13. API Health
**GET** `/api/health`

Check if API is running.

**Response (200):**
```json
{
  "status": "LearnHub API is running"
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "error": "Error message here"
}
```

### Common HTTP Status Codes

| Status | Meaning |
|--------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden (Invalid token) |
| 404 | Not Found |
| 413 | Payload Too Large |
| 500 | Server Error |

---

## Example Usage (JavaScript/Fetch)

### Register
```javascript
const response = await fetch('http://localhost:5000/api/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'john_doe',
    email: 'john@example.com',
    password: 'password123'
  })
});
const data = await response.json();
```

### Login
```javascript
const response = await fetch('http://localhost:5000/api/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'john@example.com',
    password: 'password123'
  })
});
const data = await response.json();
const token = data.token; // Store this for future requests
```

### Upload Document
```javascript
const formData = new FormData();
formData.append('document', fileInput.files[0]);
formData.append('document_title', 'My Learning Material');

const response = await fetch('http://localhost:5000/api/documents/upload', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});
const data = await response.json();
```

### Get Documents
```javascript
const response = await fetch('http://localhost:5000/api/documents', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const documents = await response.json();
```

### Update Progress
```javascript
const response = await fetch('http://localhost:5000/api/progress/5', {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    pages_read: 50,
    total_pages: 100
  })
});
const data = await response.json();
```

---

## Token Information

JWT tokens include:
- User ID
- Email
- Username
- Expiration time (24 hours)

Tokens are signed with a secret key and cannot be modified without detection.

---

## Rate Limiting

Currently no rate limiting is implemented. For production, consider adding:
- Request rate limits per IP
- Request rate limits per user
- Throttling for upload endpoints

---

## CORS

CORS is enabled for all origins in development. For production, restrict to your domain:

```javascript
// In backend
const cors = require('cors');
app.use(cors({
  origin: 'https://yourdomain.com'
}));
```

---

## Deployment Notes

1. **Change secret keys** before production
2. **Use environment variables** for configuration
3. **Enable HTTPS** for all endpoints
4. **Set up backups** for SQLite database
5. **Monitor upload folder** disk space
6. **Implement rate limiting** for security
7. **Add request logging** for debugging
8. **Set up error monitoring** (Sentry, etc.)

---

## Support

For API issues, check:
1. Server logs for error messages
2. Browser console (F12) for client errors
3. Network tab to see actual API responses
4. Verify token is valid and not expired
