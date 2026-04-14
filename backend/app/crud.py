from typing import List, Optional
from sqlalchemy.orm import Session
from . import models, schemas
from .auth import get_password_hash


# ──────────────────────────────────────────────
# Users / Auth
# ──────────────────────────────────────────────
def get_user_by_email(db: Session, email: str) -> Optional[models.User]:
    return db.query(models.User).filter(models.User.email == email).first()


def get_user_by_id(db: Session, user_id: int) -> Optional[models.User]:
    return db.query(models.User).filter(models.User.id == user_id).first()


def create_user(db: Session, data: schemas.UserCreate, role: models.UserRole = models.UserRole.customer) -> models.User:
    user = models.User(
        name=data.name,
        email=data.email,
        hashed_password=get_password_hash(data.password),
        role=role,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    # Auto-create blank profile
    profile = models.PatientProfile(user_id=user.id)
    db.add(profile)
    db.commit()
    return user


def get_all_patients(db: Session) -> List[models.User]:
    return (
        db.query(models.User)
        .filter(models.User.role == models.UserRole.customer)
        .all()
    )


# ──────────────────────────────────────────────
# Patient Profile
# ──────────────────────────────────────────────
def get_profile(db: Session, user_id: int) -> Optional[models.PatientProfile]:
    return db.query(models.PatientProfile).filter(models.PatientProfile.user_id == user_id).first()


def upsert_profile(db: Session, user_id: int, data: schemas.PatientProfileUpdate) -> models.PatientProfile:
    profile = get_profile(db, user_id)
    if not profile:
        profile = models.PatientProfile(user_id=user_id)
        db.add(profile)
    if data.blood_group is not None:
        profile.blood_group = data.blood_group
    if data.address is not None:
        profile.address = data.address
    if data.health_concerns is not None:
        profile.health_concerns = data.health_concerns
    db.commit()
    db.refresh(profile)
    return profile


# ──────────────────────────────────────────────
# Medicines
# ──────────────────────────────────────────────
def get_medicines(db: Session, skip: int = 0, limit: int = 100) -> List[models.Medicine]:
    return db.query(models.Medicine).offset(skip).limit(limit).all()


def get_medicine(db: Session, medicine_id: int) -> Optional[models.Medicine]:
    return db.query(models.Medicine).filter(models.Medicine.id == medicine_id).first()


def create_medicine(db: Session, data: schemas.MedicineCreate) -> models.Medicine:
    medicine = models.Medicine(**data.model_dump())
    db.add(medicine)
    db.commit()
    db.refresh(medicine)
    return medicine


def update_medicine(db: Session, medicine_id: int, data: schemas.MedicineUpdate) -> Optional[models.Medicine]:
    medicine = get_medicine(db, medicine_id)
    if not medicine:
        return None
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(medicine, field, value)
    db.commit()
    db.refresh(medicine)
    return medicine


def delete_medicine(db: Session, medicine_id: int) -> bool:
    medicine = get_medicine(db, medicine_id)
    if not medicine:
        return False
    db.delete(medicine)
    db.commit()
    return True


# ──────────────────────────────────────────────
# Orders
# ──────────────────────────────────────────────
def create_order(db: Session, user_id: int, data: schemas.OrderCreate) -> models.Order:
    total = 0.0
    items_to_add = []

    for item_data in data.items:
        medicine = get_medicine(db, item_data.medicine_id)
        if not medicine:
            raise ValueError(f"Medicine id={item_data.medicine_id} not found")
        line_total = medicine.price * item_data.quantity
        total += line_total
        items_to_add.append(
            models.OrderItem(
                medicine_id=medicine.id,
                medicine_name=medicine.name,
                quantity=item_data.quantity,
                unit_price=medicine.price,
            )
        )
        # Decrement stock
        medicine.stock = max(0, medicine.stock - item_data.quantity)

    order = models.Order(user_id=user_id, total=round(total, 2))
    db.add(order)
    db.flush()  # get order.id before committing

    for item in items_to_add:
        item.order_id = order.id
        db.add(item)

    db.commit()
    db.refresh(order)
    return order


def get_orders_for_user(db: Session, user_id: int) -> List[models.Order]:
    return (
        db.query(models.Order)
        .filter(models.Order.user_id == user_id)
        .order_by(models.Order.created_at.desc())
        .all()
    )


def get_all_orders(db: Session) -> List[models.Order]:
    return db.query(models.Order).order_by(models.Order.created_at.desc()).all()


def update_order_status(db: Session, order_id: int, status: models.OrderStatus) -> Optional[models.Order]:
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not order:
        return None
    order.status = status
    db.commit()
    db.refresh(order)
    return order


# ──────────────────────────────────────────────
# Hospitals
# ──────────────────────────────────────────────
def get_hospitals(db: Session) -> List[models.Hospital]:
    return db.query(models.Hospital).all()


def create_hospital(db: Session, data: schemas.HospitalCreate) -> models.Hospital:
    hospital = models.Hospital(**data.model_dump())
    db.add(hospital)
    db.commit()
    db.refresh(hospital)
    return hospital


# ──────────────────────────────────────────────
# Dashboard Stats
# ──────────────────────────────────────────────
LOW_STOCK_THRESHOLD = 100

def get_admin_stats(db: Session) -> schemas.AdminStatsResponse:
    total_orders = db.query(models.Order).count()
    pending_orders = db.query(models.Order).filter(models.Order.status == models.OrderStatus.Pending).count()
    low_stock_count = db.query(models.Medicine).filter(models.Medicine.stock < LOW_STOCK_THRESHOLD).count()
    total_patients = db.query(models.User).filter(models.User.role == models.UserRole.customer).count()
    return schemas.AdminStatsResponse(
        total_orders=total_orders,
        pending_orders=pending_orders,
        low_stock_count=low_stock_count,
        total_patients=total_patients,
    )
