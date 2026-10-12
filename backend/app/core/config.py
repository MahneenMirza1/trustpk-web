"""Environment-based application settings."""

from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    database_url: str = "postgresql://postgres:changeme@db:5432/trustpk"
    backend_port: int = 8000
    frontend_url: str = "http://localhost:3000"
    environment: str = "development"
    app_name: str = "TrustPK API"
    job_update_interval_hours: int = 12
    enable_job_scheduler: bool = True

    @property
    def cors_origins(self) -> list[str]:
        """Allowed CORS origins derived from FRONTEND_URL."""
        origins = [origin.strip() for origin in self.frontend_url.split(",") if origin.strip()]
        return origins or ["http://localhost:3000"]


@lru_cache
def get_settings() -> Settings:
    """Return a cached Settings instance."""
    return Settings()
