from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, EmailStr, field_validator
from .models import OrderStatus, UserRole


# ──────────────────────────────────────────────
# Auth / Users
# ──────────────────────────────────────────────
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    role: UserRole
    created_at: datetime

    model_config = {"from_attributes": True}


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


# ──────────────────────────────────────────────
# Patient Profile
# ──────────────────────────────────────────────
class PatientProfileUpdate(BaseModel):
    blood_group: Optional[str] = None
    address: Optional[str] = None
    health_concerns: Optional[str] = None


class PatientProfileResponse(BaseModel):
    id: int
    user_id: int
    blood_group: str
    address: str
    health_concerns: str
    updated_at: Optional[datetime]

    model_config = {"from_attributes": True}


class PatientFullResponse(BaseModel):
    """User + profile combined for the patient list."""
    id: int
    name: str
    email: str
    blood_group: str
    health_concerns: str

    model_config = {"from_attributes": True}


# ──────────────────────────────────────────────
# Medicines
# ──────────────────────────────────────────────
class MedicineCreate(BaseModel):
    name: str
    category: Optional[str] = "General"
    description: Optional[str] = ""
    price: float
    stock: int = 0
    image_url: Optional[str] = ""

    @field_validator("price")
    @classmethod
    def price_must_be_positive(cls, v: float) -> float:
        if v < 0:
            raise ValueError("Price must be positive")
        return v


class MedicineUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    stock: Optional[int] = None
    image_url: Optional[str] = None


class MedicineResponse(BaseModel):
    id: int
    name: str
    category: str
    description: str
    price: float
    stock: int
    image_url: str
    created_at: datetime

    model_config = {"from_attributes": True}


# ──────────────────────────────────────────────
# Orders
# ──────────────────────────────────────────────
class OrderItemCreate(BaseModel):
    medicine_id: int
    quantity: int


class OrderCreate(BaseModel):
    items: List[OrderItemCreate]


class OrderItemResponse(BaseModel):
    id: int
    medicine_id: Optional[int]
    medicine_name: str
    quantity: int
    unit_price: float

    model_config = {"from_attributes": True}


class OrderResponse(BaseModel):
    id: int
    user_id: int
    total: float
    status: OrderStatus
    created_at: datetime
    items: List[OrderItemResponse] = []
    # Flatten user info for admin convenience
    user_name: Optional[str] = None
    user_email: Optional[str] = None

    model_config = {"from_attributes": True}


class OrderStatusUpdate(BaseModel):
    status: OrderStatus


# ──────────────────────────────────────────────
# Hospitals
# ──────────────────────────────────────────────
class HospitalCreate(BaseModel):
    name: str
    contact: Optional[str] = ""
    address: Optional[str] = ""


class HospitalResponse(BaseModel):
    id: int
    name: str
    contact: str
    address: str
    created_at: datetime

    model_config = {"from_attributes": True}


# ──────────────────────────────────────────────
# Dashboard
# ──────────────────────────────────────────────
class AdminStatsResponse(BaseModel):
    total_orders: int
    pending_orders: int
    low_stock_count: int
    total_patients: int
