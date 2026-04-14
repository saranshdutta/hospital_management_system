from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from .. import crud, schemas
from ..auth import require_admin
from ..database import get_db

router = APIRouter(prefix="/hospitals", tags=["Hospitals"])


@router.get("", response_model=List[schemas.HospitalResponse])
def list_hospitals(db: Session = Depends(get_db)):
    """Public — list all partner hospitals."""
    return crud.get_hospitals(db)


@router.post("", response_model=schemas.HospitalResponse, status_code=status.HTTP_201_CREATED)
def create_hospital(
    data: schemas.HospitalCreate,
    db: Session = Depends(get_db),
    _admin=Depends(require_admin),
):
    """Admin only — add a new hospital to the directory."""
    return crud.create_hospital(db, data)
