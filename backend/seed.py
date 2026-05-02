import os

from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")

# Allow TLS without certificate validation
client = MongoClient(MONGO_URI, tls=True, tlsAllowInvalidCertificates=True)

db = client["learn60sec"]
topics_collection = db["topics"]

test_topic = {
    "title": "Intro to Python",
    "content": "Python is a versatile language used for web, data, and AI.",
    "code_snippets": ["print('Hello, World!')"],
}

topics_collection.insert_one(test_topic)
