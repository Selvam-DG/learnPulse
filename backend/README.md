## Run locally

### 1. Create `.env` file
- Copy `.env.example` to `´.env` and fill values

### 2. Create and activate virtual environment
```bash
python -m venv env && source .env/bin/activate

```
### 3. Install dependencies
```bash
pip install -r requirements.txt
```

## Start Locally
```bash
flask --app wsgi:app run --debug
#or gunicorn
gunicorn -c gunicorn.conf.py wsgi:apps
```