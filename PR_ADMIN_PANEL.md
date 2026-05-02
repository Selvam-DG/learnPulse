
# PR: Add Admin Panel, JWT Auth, Suggestions Management, and UI Improvements

## Summary

This PR adds a full admin content management workflow to LearnPulse. It includes JWT-based admin authentication, admin dashboard pages, topic and lesson management, user suggestion review, improved public UI, dark/light mode refinements, Docker/Nginx updates, and updated documentation.

The admin panel is hidden from the public navbar by default. Once logged in, admins can access the dashboard from the navbar and manage platform content.

---

## Major Changes

### Backend

- Added admin authentication route:
  - `POST /api/admin/login`
  - `POST /api/admin/refresh`
  - `GET /api/admin/me`
- Added JWT access token and refresh token support.
- Updated admin route protection using Bearer tokens.
- Added admin-protected suggestion management:
  - `GET /api/admin/suggestions`
  - `PUT /api/admin/suggestions/<id>`
  - `DELETE /api/admin/suggestions/<id>`
- Updated feedback suggestions to store:
  - `status`
  - `source`
  - `admin_note`
  - `created_at`
  - `updated_at`
- Updated lessons to store:
  - `created_at`
  - `updated_at`
- Improved lesson serialization for MongoDB datetime fields.
- Fixed MongoDB topic slug index from `slugs` to `slug`.
- Added optional SMTP configuration fields.
- Updated CORS support for local frontend ports.
- Updated Dockerfile and Gunicorn startup configuration.

### Frontend

- Added admin login page.
- Added protected admin layout.
- Added admin dashboard.
- Added topic management page.
- Added lesson management page.
- Added suggestions management page.
- Admin can create, edit, and delete topics.
- Admin can create, edit, and delete lessons.
- Admin can click a lesson to edit its content.
- Admin can review, edit, mark added/rejected, or delete user suggestions.
- Navbar now shows Admin Dashboard and Logout after admin login.
- Improved dark/light mode UI support.
- Improved Home page messaging and stats.
- Improved Suggest page UI.
- Improved Lesson modal behavior and copy code flow.
- Added Nginx config for Docker frontend proxying `/api/*` to backend.

### Documentation

- Updated root README.
- Updated backend README.
- Updated frontend README.
- Added deployment and Docker notes.
- Added environment variable documentation.
- Added testing and code quality notes.

---

## New Admin Routes

```text
/admin/login
/admin
/admin/topics
/admin/lessons
/admin/suggestions
````

---

## New/Updated API Endpoints

### Admin Auth

```text
POST /api/admin/login
POST /api/admin/refresh
GET  /api/admin/me
```

### Topics

```text
GET    /api/topics
POST   /api/topics
PUT    /api/topics/<slug>
DELETE /api/topics/<slug>
```

### Lessons

```text
GET    /api/topics/<slug>/lessons?level=basics
GET    /api/lessons/<slug>
POST   /api/lessons
PUT    /api/lessons/<slug>
DELETE /api/lessons/<slug>
```

### Suggestions

```text
POST   /api/feedback
GET    /api/admin/suggestions?status=all
PUT    /api/admin/suggestions/<id>
DELETE /api/admin/suggestions/<id>
```

---

## Environment Variables Added

```env
PORT=5180
WEB_CONCURRENCY=2
GUNICORN_TIMEOUT=120

JWT_ACCESS_MINUTES=15
JWT_REFRESH_DAYS=7

SMTP_HOST=
SMTP_PORT=465
SMTP_FROM=
SMTP_USER=
SMTP_PASS=
```

---

## Manual Test Checklist

### Public UI

* [x] Home page loads.
* [x] Dark/light mode toggle works.
* [x] Topics load on home page.
* [x] Learn page loads topics.
* [x] Level tabs load lessons.
* [x] Lesson modal opens.
* [x] Lesson modal background does not scroll.
* [x] Suggest page submits topic suggestion.
* [x] Suggest page supports dark mode.

### Admin Auth

* [x] `/admin/login` loads.
* [x] Invalid login shows error.
* [x] Valid login redirects to `/admin`.
* [x] Admin Dashboard appears in navbar after login.
* [x] Logout clears tokens and returns to home.
* [x] Admin routes redirect to login when logged out.

### Admin Topics

* [x] Admin can create topic.
* [x] Admin can edit topic.
* [x] Admin can delete topic.
* [x] Topic appears on public pages.

### Admin Lessons

* [x] Admin can create lesson.
* [x] Admin can click lesson to edit.
* [x] Admin can update lesson.
* [x] Admin can delete lesson.
* [x] Last edited date appears after update.
* [x] Lesson appears on public Learn page.

### Admin Suggestions

* [x] Submitted suggestions appear in admin suggestions page.
* [x] Admin can edit suggestion.
* [x] Admin can mark suggestion as reviewing.
* [x] Admin can mark suggestion as added.
* [x] Admin can mark suggestion as rejected.
* [x] Admin can delete suggestion.

### Backend

* [x] `/api/health` returns success.
* [x] `/api/admin/login` returns tokens.
* [x] Protected routes reject missing token.
* [x] Protected routes accept valid admin token.
* [x] MongoDB indexes are created without conflicts.

### Docker

* [x] `docker compose config` succeeds.
* [x] `docker compose build` succeeds.
* [x] `docker compose up --build` starts frontend and backend.
* [x] `http://localhost:8080` loads frontend.
* [x] `http://localhost:8080/api/health` reaches backend through Nginx.

---

## Checks Run Locally

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

Pytest database tests are not enabled in CI yet because they require a running MongoDB test service. They can be added later with a GitHub Actions MongoDB service container.

---

## Deployment Notes

### Backend

Use Render environment variables for production secrets. Do not commit `.env.prod`.

Recommended production command:

```bash
gunicorn wsgi:app --bind 0.0.0.0:$PORT
```

### Frontend

Use Vercel with:

```text
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
```

Set:

```env
VITE_API_URI=https://your-backend-url.onrender.com
```

---

## Risk / Notes

* Existing lessons may not have `created_at` or `updated_at`; UI handles this by showing `Never`.
* Existing feedback items may not have `status`; new suggestions default to `new`.

* Production secrets must be configured in Render/Vercel dashboards, not committed.

---

## Recommended Merge Target

Merge `admin-panel` into `main` after manual testing passes.
