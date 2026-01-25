# LearnPulse Frontend  
React + Vite + TailwindCSS

The LearnPulse frontend provides a clean and fast UI for exploring lessons, topics, and concept summaries.  
Built using modern tools for optimal performance and developer experience.

---

## Directory Structure

```

frontend/
│
├── index.html
├── vite.config.js
├── tailwind.config.js
│
├── src/
│   ├── App.jsx
│   ├── api.js
│   ├── index.css
│   ├── main.jsx
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── LessonCard.jsx
│   │   ├── LessonModal.jsx
│   │   ├── SearchBox.jsx
│   │   ├── LevelTabs.jsx
│   │   └── TopicPills.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Learn.jsx
│   │   └── Suggest.jsx
│   └── hooks/
│       └── UseDarkMode.js

```

---

## Setup Instructions

### **1. Install dependencies**
```bash
npm install
````

### **2. Start the development server**

```bash
npm run dev
```

Your app will be available at:
**[http://localhost:5173](http://localhost:5173)**

---

## API Configuration

API base URL is inside:

```
src/api.js
```

Set your backend URL:

```js
const API_BASE = "http://localhost:5000/api";
```

---

## Pages

| Page        | Description                     |
| ----------- | ------------------------------- |
| **Home**    | Explore topics & start learning |
| **Learn**   | View lesson lists & details     |
| **Suggest** | Submit user feedback            |

---

##  Styling

* TailwindCSS utility-first styling
* Custom dark mode hook: `UseDarkMode.js`
* Responsive grid layout

---

## 🛠 Production Build

```bash
npm run build
```

Output will be in:

```
dist/
```

---

##  License

MIT License © LearnPulse


