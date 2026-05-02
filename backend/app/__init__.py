from flask import Flask, jsonify
from flask_cors import CORS

from .config import settings
from .db import ensure_indexes
from .routes.admin_auth import bp as admin_auth_bp
from .routes.feedback import bp as feedback_bp
from .routes.health import bp as health_bp
from .routes.lessons import bp as lessons_bp
from .routes.topics import bp as topics_bp


def create_app():
    app = Flask(__name__)
    app.config["SECRET_KEY"] = settings.SECRET_KEY

    origins = settings.CORS_ORIGINS or []
    CORS(app, resources={r"/api/*": {"origins": origins}})

    app.register_blueprint(health_bp)
    app.register_blueprint(admin_auth_bp)
    app.register_blueprint(topics_bp)
    app.register_blueprint(lessons_bp)
    app.register_blueprint(feedback_bp)

    @app.errorhandler(400)
    @app.errorhandler(401)
    @app.errorhandler(403)
    @app.errorhandler(404)
    @app.errorhandler(409)
    @app.errorhandler(422)
    @app.errorhandler(500)
    def json_error(err):
        code = getattr(err, "code", 500)
        return jsonify({"error": getattr(err, "description", str(err))}), code

    with app.app_context():
        ensure_indexes()

    return app
