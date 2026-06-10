from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import chat
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Roast My Portfolio API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat.router)