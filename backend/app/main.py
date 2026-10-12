from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import health, jobs, universities
from app.core.config import get_settings
from app.db.database import Base, engine
from app.services.scheduler import start_scheduler, stop_scheduler


settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    start_scheduler()
    yield
    stop_scheduler()


app = FastAPI(
    title="TrustPK API",
    description="AI-Powered Citizen Digital Assistant for Government Awareness, Education, and Cybersecurity",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(universities.router)
app.include_router(jobs.router)


@app.get("/")
def root() -> dict[str, str]:
    """Root endpoint confirming the API is running."""
    return {"message": "TrustPK API is running"}