from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware import Middleware
from fastapi.staticfiles import StaticFiles

# Import routers
from .api.routes import syllabus, resources, study_plans

# CORS Configuration
origins = [
    "http://localhost:5173",
    "http://localhost:5175",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5175",
    "http://localhost:3000",
    "https://blueprintx-frontend.onrender.com",
]

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
    middleware=middleware
)

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/")
def read_root():
    return {"message": "Welcome to BlueprintX API"}

# Include routers
app.include_router(syllabus.router, prefix="/api/syllabus", tags=["syllabus"])
app.include_router(resources.router, prefix="/api/resources", tags=["resources"])
app.include_router(study_plans.router, prefix="/api/study-plans", tags=["study_plans"])

@app.get("/health")
async def health_check():
    return {"status": "healthy"}