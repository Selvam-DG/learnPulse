from flask import Flask, jsonify, request
from flask_cors import CORS
from models import topics_collection

app = Flask(__name__)
CORS(app)

@app.route("/", methods=["GET"])
def home():
    return {"message": "60-seconds learning API is running"}

@app.route("/api/topics", methods=["GET"])
def get_topics():
    topics = list(topics_collection.find({}, {"_id":0}))
    return jsonify(topics)

@app.route("/api/topics/<title>", methods = ["GET"])
def get_topic(title):
    topic = topics_collection.find_one({"title": title}, {"_id": 0})
    return jsonify(topic)
