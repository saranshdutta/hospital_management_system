from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .. import crud, schemas
from ..auth import get_current_user, require_admin
from ..database import get_db

router = APIRouter(prefix="/medicines", tags=["Medicines"])


@router.get("", response_model=List[schemas.MedicineResponse])
def list_medicines(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Public endpoint — list all medicines."""
    return crud.get_medicines(db, skip=skip, limit=limit)


@router.get("/{medicine_id}", response_model=schemas.MedicineResponse)
def get_medicine(medicine_id: int, db: Session = Depends(get_db)):
    """Public endpoint — get a single medicine by ID."""
    med = crud.get_medicine(db, medicine_id)
    if not med:
        raise HTTPException(status_code=404, detail="Medicine not found")
    return med


@router.post("", response_model=schemas.MedicineResponse, status_code=status.HTTP_201_CREATED)
def create_medicine(
    data: schemas.MedicineCreate,
    db: Session = Depends(get_db),
    _admin=Depends(require_admin),
):
    """Admin only — add a new medicine to inventory."""
    return crud.create_medicine(db, data)


@router.put("/{medicine_id}", response_model=schemas.MedicineResponse)
def update_medicine(
    medicine_id: int,
    data: schemas.MedicineUpdate,
    db: Session = Depends(get_db),
    _admin=Depends(require_admin),
):
    """Admin only — update medicine details or stock."""
    med = crud.update_medicine(db, medicine_id, data)
    if not med:
        raise HTTPException(status_code=404, detail="Medicine not found")
    return med


@router.delete("/{medicine_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_medicine(
    medicine_id: int,
    db: Session = Depends(get_db),
    _admin=Depends(require_admin),
):
    """Admin only — remove a medicine from inventory."""
    if not crud.delete_medicine(db, medicine_id):
        raise HTTPException(status_code=404, detail="Medicine not found")
