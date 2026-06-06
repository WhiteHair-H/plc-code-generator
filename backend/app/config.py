from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    OPENROUTER_API_KEY: str = ""
    OPENROUTER_MODEL: str = "anthropic/claude-3-haiku"
    AWS_REGION: str = "us-east-1"
    AWS_ACCESS_KEY_ID: str = ""
    AWS_SECRET_ACCESS_KEY: str = ""
    DYNAMODB_TABLE: str = "plc-codes"
    FRONTEND_URL: str = "http://localhost:3000"

    class Config:
        env_file = ("../.env", ".env")

settings = Settings()
