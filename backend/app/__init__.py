from flask import Flask, jsonify
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from .config import settings
from .db import ensure_indexes
from .routes.health import bp as health_bp
from .routes.topics import bp as topics_bp
from .routes.lessons import bp as lessons_bp
from .routes.feedback import bp as feedback_bp

def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = settings.SECRET_KEY

    #CORS
    origins = settings.CORS_ORIGINS or []
    CORS(app, resources = {r"/api/*" : {"origins":origins}})

    #Rate Limiting
    limiter = Limiter(get_remote_address, app=app, default_limits=["200 per hour"])

    #Blueprints
    app.register_blueprint(health_bp)
    app.register_blueprint(topics_bp)
    app.register_blueprint(lessons_bp)
    app.register_blueprint(feedback_bp)

    #Error handlers
    @app.errorhandler(400)
    @app.errorhandler(401)
    @app.errorhandler(403)
    @app.errorhandler(404)
    @app.errorhandler(409)
    @app.errorhandler(422)
    @app.errorhandler(500)
    def json_error(err):
        code = getattr(err, "code", 500)
        return jsonify( {"error": getattr(err, "description", str(err))}), code
    
    #create indexes at startup
    with app.app_context():
        ensure_indexes()

    return app
    