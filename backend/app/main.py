from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware import Middleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager

# Import routers
from .api.routes import syllabus
from .core.database import connect_to_mongo, close_mongo_connection

# CORS Configuration
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "https://blueprintx-frontend.onrender.com",
]

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Connect to MongoDB
    await connect_to_mongo()
    yield
    # Shutdown: Close connection
    await close_mongo_connection()

middleware = [
    Middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
        expose_headers=["*"],
        max_age=600,
    )
]

app = FastAPI(
    title="BlueprintX API", 
    version="0.1.0",
    middleware=middleware,
    lifespan=lifespan
)

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/")
def read_root():
    return {"message": "Welcome to BlueprintX API"}

# Include routers
from .api.routes import syllabus, analysis, auth
app.include_router(syllabus.router, prefix="/api/syllabus", tags=["syllabus"])
app.include_router(analysis.router, prefix="/api/analysis", tags=["analysis"])
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])

@app.get("/health")
async def health_check():
    return {"status": "healthy"}