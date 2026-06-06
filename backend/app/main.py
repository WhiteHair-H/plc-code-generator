from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .routes import generate, codes, analyze

app = FastAPI(title="PLC Code Generator API", version="1.0.0")

app.add_middleware(CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(generate.router, prefix="/api")
app.include_router(codes.router,    prefix="/api")
app.include_router(analyze.router,  prefix="/api")

@app.get("/health")
def health():
    return {"status": "ok"}
