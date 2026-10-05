import os
import json
import time
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from pydantic import BaseModel
from api.routers import metadata, tags

app = FastAPI(title="ClockIt!-api")

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(metadata.ap)
app.include_router(tags.tag)

@app.get('/status')
def running():
    return {"FastAPI is running!"}

BASE_DIR = Path(__file__).resolve().parent.parent
app.mount("/html", StaticFiles(directory=BASE_DIR / "html"), name="html")
app.mount("/css", StaticFiles(directory=BASE_DIR / "css"), name="css")
app.mount("/js", StaticFiles(directory=BASE_DIR / "js"), name="js")
app.mount("/img", StaticFiles(directory=BASE_DIR / "img"), name="img")

@app.get('/' or '/dashboard')
def dashboard() :
    return FileResponse(BASE_DIR / "html" / "index.html")

@app.get('/visualize')
def visualize() :
    return FileResponse(BASE_DIR / "html" / "visualize.html")

@app.get('/config')
def config() :
    return FileResponse(BASE_DIR / "html" / "config.html")