#  LearnPulse  
### Fast Concepts. Clear Insights.

LearnPulse is a micro-learning platform that provides **quick, concise concept summaries** across subjects like programming, DSA, mathematics, science, and history.  
Designed for fast learning and quick revision, LearnPulse delivers knowledge in easy-to-digest bursts.

This repository contains the **backend (Flask API + MongoDB)** and **frontend (React + Vite + TailwindCSS)** applications.

---

## Project Structure

```

learnPulse/
│
├── backend/        # Flask REST API + MongoDB
├── frontend/       # React (Vite) + TailwindCSS
├── LICENSE
└── README.md       # Main project documentation

````

---

## Quick Start

### **1. Clone the repository**
```bash
git clone https://github.com/yourusername/learnpulse.git
cd learnpulse
````

### **2. Setup Backend**

See full backend setup:
[backend/README.md](./backend/README.md)

```bash
cd backend
pip install -r requirements.txt
python wsgi.py
```

### **3. Setup Frontend**

See full frontend setup:
[frontend/README.md](./frontend/README.md)

```bash
cd frontend
npm install
npm run dev
```

---

##  Features

*  Quick concept recaps
*  Multi-subject lessons
*  Search + filtering
*  Topic-based navigation
*  Feedback suggestions
*  Responsive UI for fast learning
*  REST API backend
*  MongoDB database

---

##  Technology Stack

### **Frontend**

* React (Vite)
* TailwindCSS
* JSX Components

### **Backend**

* Flask API
* Gunicorn (production)
* MongoDB
* JWT Authentication

---

##  Roadmap

* [ ] User accounts + saved lessons
* [ ] Flashcards learning mode
* [ ] AI-generated summaries
* [ ] Mobile app (React Native)
* [ ] Enhanced search features
* [ ] Instructor/Creator portal

---

##  Contributing

Contributions, ideas, and feedback are welcome.
Open an issue or submit a pull request.

---

##  License

MIT License © 2024 LearnPulse

