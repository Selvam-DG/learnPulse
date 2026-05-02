# LearnPulse Frontend

React + Vite + TailwindCSS

The LearnPulse frontend provides the public learning experience and the admin content management panel.

---

## Features

### Public UI

- Home page with topic cards
- Learn page with topic selector
- Level tabs: basics, intermediate, advanced
- Search and filtering
- Lesson cards
- Lesson modal with markdown content
- Code snippets
- Copy code button
- Dark/light mode
- Suggest topic page
- Responsive layout

### Admin UI

- Hidden admin login route
- Admin dashboard
- Topic management
- Lesson management
- Click lesson to edit
- Create, update, and delete lessons
- Last edited date display
- Suggestions review page
- Edit, reject, add, or delete user suggestions
- Admin dashboard link in navbar after login
- Logout from navbar and admin layout

---

## Directory Structure

```text
frontend/
├── index.html
├── nginx.conf
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── src/
│   ├── App.jsx
│   ├── api.js
│   ├── index.css
│   ├── main.jsx
│   ├── components/
│   │   ├── Footer.jsx
│   │   ├── LessonCard.jsx
│   │   ├── LessonModal.jsx
│   │   ├── LevelTabs.jsx
│   │   ├── Navbar.jsx
│   │   ├── SearchBox.jsx
│   │   └── TopicPills.jsx
│   ├── hooks/
│   │   └── UseDarkMode.js
│   └── pages/
│       ├── Home.jsx
│       ├── Learn.jsx
│       ├── Suggest.jsx
│       └── admin/
│           ├── AdminDashboard.jsx
│           ├── AdminLayout.jsx
│           ├── AdminLessons.jsx
│           ├── AdminLogin.jsx
│           ├── AdminSuggestions.jsx
│           └── AdminTopics.jsx
```

---

## Setup

### 1. Install dependencies

```bash
cd frontend
npm install
```

### 2. Create environment file

For local development:

```env
VITE_API_URI=http://127.0.0.1:5123
```

If using Docker + Nginx proxy, leave it empty:

```env
VITE_API_URI=
```

---

## Run Development Server

```bash
npm run dev
```

Vite usually runs at:

```text
http://localhost:5173
```

In VS Code remote port forwarding, it may open as:

```text
http://localhost:5174
```

Make sure the backend `CORS_ORIGINS` includes whichever URL your browser uses.

---

## Build

```bash
npm run build
```

Output:

```text
dist/
```

Preview production build:

```bash
npm run preview
```

---

## Scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
npm run format
npm run format:check
npm run check
```

Recommended pre-push check:

```bash
npm run check
```

---

## API Configuration

The frontend API client is in:

```text
src/api.js
```

The base URL is read from:

```js
import.meta.env.VITE_API_URI;
```

For local development:

```env
VITE_API_URI=http://127.0.0.1:5123
```

For Docker/Nginx:

```env
VITE_API_URI=
```

When empty, API calls use relative routes such as:

```text
/api/topics
/api/feedback
/api/admin/login
```

---

## Routes

### Public Routes

| Route               | Description                  |
| ------------------- | ---------------------------- |
| `/`                 | Home page                    |
| `/learn`            | Learn page                   |
| `/learn/:topicSlug` | Learn page filtered by topic |
| `/suggest`          | Suggest a topic              |

### Admin Routes

| Route                | Description             |
| -------------------- | ----------------------- |
| `/admin/login`       | Hidden admin login      |
| `/admin`             | Admin dashboard         |
| `/admin/topics`      | Manage topics           |
| `/admin/lessons`     | Manage lessons          |
| `/admin/suggestions` | Review user suggestions |

The public navbar does not show admin login. After admin login, the navbar shows:

```text
Admin Dashboard
Logout
```

---

## Admin Authentication Flow

1. Admin logs in at `/admin/login`
2. Backend returns:
   - `access_token`
   - `refresh_token`

3. Frontend stores tokens in localStorage:
   - `adminAccessToken`
   - `adminRefreshToken`

4. Admin API requests use:
   - `Authorization: Bearer <access_token>`

5. If access token fails, frontend attempts refresh
6. If refresh fails, frontend redirects to `/admin/login`

---

## Dark Mode

Dark mode uses:

```text
src/hooks/UseDarkMode.js
```

It stores theme preference in localStorage and toggles the `dark` class on the document root.

---

## Styling

- TailwindCSS utility-first styling
- Responsive layout
- Dark mode variants
- Admin layout with sidebar
- Public layout with sticky navbar
- Markdown content rendering
- PrismJS syntax highlighting

---

## Docker / Nginx

The frontend Docker image builds the Vite app and serves it through Nginx.

Nginx proxies API requests:

```text
/api/* → backend container
```

This avoids browser CORS issues in Docker Compose.

---

## Deployment

### Vercel

Recommended settings:

```text
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
```

Set production API URL:

```env
VITE_API_URI=https://your-render-backend-url.onrender.com
```

### Docker

From project root:

```bash
docker compose up --build
```

Open:

```text
http://localhost:8080
```

---

## License

MIT License © LearnPulse
