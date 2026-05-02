from typing import List, Optional

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    SECRET_KEY: str = "dev"
    FLASK_ENV: str = "development"

    PORT: int = 5180
    WEB_CONCURRENCY: int = 2
    GUNICORN_TIMEOUT: int = 120

    MONGODB_URI: str
    MONGODB_DB: str

    # CORS
    CORS_ORIGINS: List[str] = []

    # Admin auth
    ADMIN_BEARER_TOKEN: str = ""
    ADMIN_USERNAME: str = ""
    ADMIN_PASSWORD: str = ""

    # JWT
    JWT_ACCESS_MINUTES: int = 15
    JWT_REFRESH_DAYS: int = 7

    # Optional SMTP for suggestion emails
    SMTP_HOST: Optional[str] = None
    SMTP_PORT: int = 465
    SMTP_FROM: Optional[str] = None
    SMTP_USER: Optional[str] = None
    SMTP_PASS: Optional[str] = None

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
