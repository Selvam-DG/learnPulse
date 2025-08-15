from pydantic_settings import BaseSettings
from pydantic import AnyHttpUrl
from typing import List

class Settings(BaseSettings):
    SECRET_KEY: str = "dev"
    FLASK_ENV:str ="development"
    MONGODB_URI:str
    MONGODB_DB:str

    #CORS
    CORS_ORIGINS:List[str] = []

    #Admin auth
    ADMIN_BEARER_TOKEN:str =""

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()