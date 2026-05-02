# LearnPulse

### Fast Concepts. Clear Insights.

LearnPulse is a focused learning and revision platform that helps users understand topics through short, structured concept cards.

It is designed for students, developers, and self-learners who want to quickly revise topics across programming, DSA, math, science, history, and other subjects without reading long tutorials.

This repository contains both the backend and frontend applications.

---

## Project Structure

```text
learnPulse/
├── backend/              # Flask REST API + MongoDB
├── frontend/             # React + Vite + TailwindCSS
├── docker-compose.yml    # Full-stack Docker setup
├── .env.example          # Example environment variables
├── LICENSE
└── README.md
```

---

## Features

### Public Learning Platform

* Topic-based learning
* Level-based lessons: basics, intermediate, advanced
* Focused concept cards
* Lesson detail modal with markdown content
* Code snippets with copy support
* Search and filtering
* Dark/light mode
* Responsive UI
* User topic suggestion form

### Admin Panel

* Hidden admin login route
* JWT access token and refresh token authentication
* Protected admin routes
* Admin dashboard
* Manage topics
* Manage lessons
* Click lesson cards to edit content
* Create, update, and delete lessons
* Track lesson `created_at` and `updated_at`
* Review suggested topics from users
* Mark suggestions as new, reviewing, added, or rejected
* Edit or delete suggestions
* Admin logout
* Admin dashboard link appears in navbar after login

### Backend

* Flask REST API
* MongoDB database
* Pydantic validation
* JWT admin authentication
* CORS support
* Gunicorn production server
* Docker support
* MongoDB indexes for topics, lessons, search, and feedback

### Frontend

* React + Vite
* TailwindCSS
* React Router
* React Markdown
* PrismJS syntax highlighting
* Dark/light theme persistence
* Admin UI and public UI

---

## Technology Stack

### Frontend

* React
* Vite
* TailwindCSS
* React Router
* React Markdown
* PrismJS

### Backend

* Flask
* MongoDB
* PyMongo
* Pydantic
* PyJWT
* Flask-CORS
* Gunicorn

### DevOps

* Docker
* Docker Compose
* Nginx for frontend container
* Render-ready backend
* Vercel-ready frontend

---

## Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/learnpulse.git
cd learnpulse
```

### 2. Backend setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
flask --app wsgi:app run --debug --host=0.0.0.0 --port=5123
```

Backend runs at:

```text
http://127.0.0.1:5123
```

### 3. Frontend setup

```bash
cd frontend
npm install
npm run dev
```

Frontend usually runs at:

```text
http://localhost:5173
```

In VS Code remote forwarding, it may open as:

```text
http://localhost:5174
```

Make sure your backend `CORS_ORIGINS` includes the actual browser origin.

---

## Docker Compose

Run the full stack with:

```bash
docker compose up --build
```

Frontend will be available at:

```text
http://localhost:8080
```

The frontend Nginx container proxies API requests to the backend container:

```text
Browser → frontend nginx → /api/* → backend
```

So frontend API calls can use relative paths such as:

```text
/api/topics
/api/feedback
/api/admin/login
```

---

## Environment Variables

Use `.env.example` as a template.

Important backend variables:

```env
FLASK_ENV=development
SECRET_KEY=change-me

PORT=5180
WEB_CONCURRENCY=2
GUNICORN_TIMEOUT=120

MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB=learnpulse

CORS_ORIGINS=["http://localhost:5173","http://localhost:5174","http://localhost:8080","http://127.0.0.1:5173","http://127.0.0.1:5174","http://127.0.0.1:8080"]

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

## Admin Access

The admin login route is intentionally hidden from the public navbar:

```text
/admin/login
```

After login, the admin can access:

```text
/admin
/admin/topics
/admin/lessons
/admin/suggestions
```

When logged in, the navbar shows:

```text
Admin Dashboard
Logout
```

---

## Common Commands

### Frontend

```bash
cd frontend
npm run dev
npm run build
npm run lint
npm run format
npm run format:check
```

### Backend

```bash
cd backend
ruff format .
ruff format --check .
ruff check .
flask --app wsgi:app run --debug --host=0.0.0.0 --port=5123
```

### Docker

```bash
docker compose config
docker compose build
docker compose up --build
```

---

## Testing Strategy

Current recommended checks before pushing:

```bash
cd frontend
npm run check
```

```bash
cd backend
ruff format --check .
ruff check .
```

```bash
cd ..
docker compose config
docker compose build
```

Pytest tests that touch MongoDB require a running MongoDB test instance. They can be enabled later with a local or CI MongoDB service.

---

## Deployment

### Backend on Render

Recommended settings:

```text
Root Directory: backend
Environment: Docker or Python
Start Command: gunicorn wsgi:app --bind 0.0.0.0:$PORT
```

Set environment variables in Render dashboard.

### Frontend on Vercel

Recommended settings:

```text
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
```

For production, set:

```env
VITE_API_URI=https://your-render-backend-url.onrender.com
```

When using Docker/Nginx, `VITE_API_URI` can be empty and API calls can use relative `/api/...` paths.

---

## Roadmap

* User accounts
* Saved lessons
* Flashcard mode
* Better lesson analytics
* Admin content publishing workflow
* Improved search
* Richer code examples
* Public topic voting
* Optional CI database integration tests

---

## License

MIT License © LearnPulse




---

