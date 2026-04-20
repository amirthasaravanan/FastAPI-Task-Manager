from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.database import engine, Base
from app.api import auth, tasks

#  database tables 
Base.metadata.create_all(bind=engine)

origins = [
    "http://localhost:3000",
    "https://fastapi-task-manager-seven.vercel.app", 
]

app = FastAPI(title="Task Manager API")

# CORS setup so the React frontend can talk to the API 
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],      # The master key
    allow_credentials=False,  # Must be False when using ["*"]
    allow_methods=["*"],      # Allows all actions (GET, POST, etc.)
    allow_headers=["*"],      # Allows all headers
)


app.include_router(auth.router, tags=["Authentication"])
app.include_router(tasks.router, prefix="/tasks", tags=["Tasks"])

@app.get("/")
def root():
    return {"message": "API is running. Go to /docs for testing."}