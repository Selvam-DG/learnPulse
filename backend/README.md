#  LearnPulse Backend  
Flask API + MongoDB

The backend powers the LearnPulse platform using a modular **Flask REST API** integrated with **MongoDB**.  
It handles lessons, topics, feedback, pagination, and health monitoring.

---

## Directory Structure

````

backend/
│
├── app/
│   ├── **init**.py
│   ├── config.py
│   ├── db.py
│   ├── models.py
│   ├── utils/
│   │   ├── auth.py
│   │   └── pagination.py
│   ├── routes/
│   │   ├── lessons.py
│   │   ├── topics.py
│   │   ├── feedback.py
│   │   └── health.py
│
├── seed.py
├── wsgi.py
├── gunicorn.conf.py
├── Dockerfile
└── requirements.txt

````

---

## Setup Instructions

### **1. Create a virtual environment**
```bash
python3 -m venv venv
source venv/bin/activate
````

### **2. Install dependencies**

```bash
pip install -r requirements.txt
```

### **3. Environment Variables**

Create a `.env` file:

```
MONGODB_URI=mongodb+srv://...
MONGODB_DB=db_name
JWT_SECRET=your_secret_key
FLASK_ENV=development
```

### **4. Run Backend in Development**

```bash
python wsgi.py
```
#### Start Locally
```bash
flask --app wsgi:app run --debug
#or gunicorn
gunicorn -c gunicorn.conf.py wsgi:apps
```
### **5. Run in Production (Gunicorn)**

```bash
gunicorn -c gunicorn.conf.py wsgi:app
```

---

## API Endpoints

| Endpoint            | Method | Description          |
| ------------------- | ------ | -------------------- |
| `/api/health`       | GET    | Check backend health |
| `/api/topics`       | GET    | Get all topics       |
| `/api/lessons`      | GET    | Get lessons          |
| `/api/lessons/<id>` | GET    | Get lesson by ID     |
| `/api/feedback`     | POST   | Submit feedback      |

---

## Database Seed (Optional)

To populate initial lessons/topics:

```bash
python seed.py
```

---

## Deployment Notes

* Gunicorn used for WSGI
* Dockerfile included for container builds
* Fully modular architecture
* Supports future admin panel or auth extensions

---

##  License

MIT License © LearnPulse

