
# LearnPulse Backend

Flask REST API + MongoDB

The LearnPulse backend powers topics, lessons, suggestions, admin authentication, and content management.

---

## Features

- Flask REST API
- MongoDB integration with PyMongo
- Pydantic request validation
- JWT admin authentication
- Access token + refresh token flow
- Protected admin routes
- Topic CRUD
- Lesson CRUD
- Lesson `created_at` and `updated_at` tracking
- User suggestion submission
- Admin suggestion review queue
- Optional SMTP email notification for suggestions
- Search endpoint
- Pagination helper
- CORS support
- Gunicorn production server
- Docker support

---

## Directory Structure

```text
backend/
├── app/
│   ├── __init__.py
│   ├── config.py
│   ├── db.py
│   ├── models.py
│   ├── routes/
│   │   ├── admin_auth.py
│   │   ├── feedback.py
│   │   ├── health.py
│   │   ├── lessons.py
│   │   └── topics.py
│   └── utils/
│       ├── auth.py
│       └── pagination.py
├── tests/
├── Dockerfile
├── gunicorn.conf.py
├── pyproject.toml
├── requirements.txt
├── seed.py
└── wsgi.py
````

---

## Setup

### 1. Create virtual environment

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
```

Or use your existing project virtual environment.

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Create environment file

```bash
cp .env.example .env
```

Example `.env`:

```env
FLASK_ENV=development
SECRET_KEY=change-me

PORT=5180
WEB_CONCURRENCY=2
GUNICORN_TIMEOUT=120

MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB=learnpulse

CORS_ORIGINS=["http://localhost:5173","http://localhost:5174","http://127.0.0.1:5173","http://127.0.0.1:5174"]

ADMIN_USERNAME=admin
ADMIN_PASSWORD=change_this
ADMIN_BEARER_TOKEN=super-secret-admin-token

JWT_ACCESS_MINUTES=15
JWT_REFRESH_DAYS=7

SMTP_HOST=
SMTP_PORT=465
SMTP_FROM=
SMTP_USER=
SMTP_PASS=
```

---

## Running Locally

### Flask development server

```bash
flask --app wsgi:app run --debug --host=0.0.0.0 --port=5123
```

Backend will run at:

```text
http://127.0.0.1:5123
```

### Gunicorn

```bash
gunicorn wsgi:app --bind 0.0.0.0:${PORT:-5180}
```

With parameters:

```bash
gunicorn wsgi:app \
  --bind 0.0.0.0:${PORT:-5180} \
  --workers ${WEB_CONCURRENCY:-2} \
  --timeout ${GUNICORN_TIMEOUT:-120} \
  --access-logfile - \
  --error-logfile -
```

---

## Docker

Build backend image:

```bash
docker build -t learnpulse-backend .
```

Run backend container:

```bash
docker run --rm -p 5180:5180 \
  --env-file .env \
  learnpulse-backend
```

---

## API Endpoints

### Health

| Method | Endpoint      | Description          |
| ------ | ------------- | -------------------- |
| GET    | `/api/health` | Backend health check |

### Topics

| Method | Endpoint             | Description  | Auth   |
| ------ | -------------------- | ------------ | ------ |
| GET    | `/api/topics`        | List topics  | Public |
| POST   | `/api/topics`        | Create topic | Admin  |
| PUT    | `/api/topics/<slug>` | Update topic | Admin  |
| DELETE | `/api/topics/<slug>` | Delete topic | Admin  |

### Lessons

| Method | Endpoint                                  | Description                     | Auth   |
| ------ | ----------------------------------------- | ------------------------------- | ------ |
| GET    | `/api/topics/<slug>/lessons?level=basics` | List lessons by topic and level | Public |
| GET    | `/api/lessons/<slug>`                     | Get lesson details              | Public |
| POST   | `/api/lessons`                            | Create lesson                   | Admin  |
| PUT    | `/api/lessons/<slug>`                     | Update lesson                   | Admin  |
| DELETE | `/api/lessons/<slug>`                     | Delete lesson                   | Admin  |
| GET    | `/api/search?q=query`                     | Search lessons                  | Public |

### Suggestions / Feedback

| Method | Endpoint                            | Description                    | Auth   |
| ------ | ----------------------------------- | ------------------------------ | ------ |
| POST   | `/api/feedback`                     | Submit public topic suggestion | Public |
| GET    | `/api/admin/suggestions?status=all` | List suggestions               | Admin  |
| PUT    | `/api/admin/suggestions/<id>`       | Edit suggestion/status         | Admin  |
| DELETE | `/api/admin/suggestions/<id>`       | Delete suggestion              | Admin  |

### Admin Auth

| Method | Endpoint             | Description            |
| ------ | -------------------- | ---------------------- |
| POST   | `/api/admin/login`   | Login admin            |
| POST   | `/api/admin/refresh` | Refresh access token   |
| GET    | `/api/admin/me`      | Validate current admin |

---

## Admin Authentication

Login response returns:

```json
{
  "access_token": "...",
  "refresh_token": "...",
  "token_type": "Bearer",
  "expires_in": 900,
  "user": {
    "username": "admin",
    "role": "admin"
  }
}
```

Protected routes require:

```http
Authorization: Bearer <access_token>
```

Refresh tokens are only used at:

```text
/api/admin/refresh
```

Refresh tokens cannot be used to create, update, or delete content.

---

## MongoDB Collections

### `topics`

```json
{
  "name": "Python",
  "slug": "python",
  "levels": ["basics", "intermediate", "advanced"],
  "order": 1
}
```

### `lessons`

```json
{
  "topic_slug": "python",
  "level": "basics",
  "order": 1,
  "title": "Variables",
  "slug": "python-variables",
  "summary": "Variables store reusable values.",
  "content_markdown": "...",
  "code_blocks": [
    {
      "language": "python",
      "snippet": "name = 'LearnPulse'"
    }
  ],
  "tags": ["python", "basics"],
  "created_at": "...",
  "updated_at": "..."
}
```

### `feedback`

```json
{
  "name": "User",
  "email": "user@example.com",
  "topic": "React Hooks",
  "message": "Please add useEffect examples.",
  "source": "web",
  "status": "new",
  "admin_note": "",
  "created_at": "...",
  "updated_at": "..."
}
```

---

## Code Quality

Run formatting:

```bash
ruff format .
```

Check formatting:

```bash
ruff format --check .
```

Run lint:

```bash
ruff check .
```

---

## Testing

Some tests require MongoDB.

To run MongoDB locally for tests:

```bash
docker run -d \
  --name learnpulse-test-mongo \
  -p 27017:27017 \
  mongo:7
```

Then:

```bash
python -m pytest -q
```

If you do not want MongoDB tests yet, use lint and format checks before deployment:

```bash
ruff format --check .
ruff check .
```

---

## Common Issues

### `jwt has no attribute encode`

Use `PyJWT`, not `jwt`, in `requirements.txt`.

Correct:

```txt
PyJWT==2.12.1
```

Wrong:

```txt
jwt
```

Code import remains:

```python
import jwt
```

### MongoDB index conflict

If an old index exists on `slugs` instead of `slug`, drop the old index:

```bash
python - <<'PY'
from app.db import db
db.topics.drop_index("topics_slug_uq")
print("Dropped old topics_slug_uq index")
PY
```

Restart Flask. The correct index will be recreated.

---

## Deployment

### Render

Use either Docker or Python environment.

Recommended start command:

```bash
gunicorn wsgi:app --bind 0.0.0.0:$PORT
```

Set production environment variables in Render dashboard.

Do not commit production `.env` files.

---

## License

MIT License © LearnPulse
