from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routes import auth, medicines, orders, patients, hospitals, dashboard

# Auto-create all tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="PharmaCare API",
    description="Hospital Pharmacy Management System REST API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# ── CORS ──────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ───────────────────────────────────
app.include_router(auth.router)
app.include_router(medicines.router)
app.include_router(orders.router)
app.include_router(patients.router)
app.include_router(hospitals.router)
app.include_router(dashboard.router)


@app.get("/", tags=["Health"])
def root():
    return {"message": "PharmaCare API is running", "version": "1.0.0"}


@app.get("/health", tags=["Health"])
def health():
    return {"status": "ok"}
