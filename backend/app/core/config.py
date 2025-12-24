from pydantic_settings import BaseSettings, SettingsConfigDict
from dotenv import load_dotenv
import os

load_dotenv() # Load environment variables from .env file

class Settings(BaseSettings):
    # Define model_config using SettingsConfigDict for v2 compatibility
    model_config = SettingsConfigDict(env_file='.env', env_file_encoding='utf-8', extra='ignore')

    PROJECT_NAME: str = "BlueprintX API"
    API_V1_STR: str = "/api"

    OLLAMA_BASE_URL: str = "http://localhost:11434"
    OLLAMA_ANALYSIS_MODEL: str = "llama3.2:3b"
    OLLAMA_GEN_MODEL: str = "gemma2:2b"

    MONGODB_URL: str = "mongodb://localhost:27017"
    DATABASE_NAME: str = "blueprintx"

    SECRET_KEY: str = "your-secret-key-change-me" # Should be in .env
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days

    # Add other settings as needed

settings = Settings()