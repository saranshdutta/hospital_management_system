from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import crud, schemas
from ..auth import get_current_user, require_admin
from ..database import get_db

router = APIRouter(prefix="/patients", tags=["Patients"])


@router.get("", response_model=List[schemas.PatientFullResponse])
def list_patients(
    db: Session = Depends(get_db),
    _admin=Depends(require_admin),
):
    """Admin only — list all customer accounts with health summary."""
    users = crud.get_all_patients(db)
    result = []
    for user in users:
        profile = user.profile
        result.append(
            schemas.PatientFullResponse(
                id=user.id,
                name=user.name,
                email=user.email,
                blood_group=profile.blood_group if profile else "",
                health_concerns=profile.health_concerns if profile else "None",
            )
        )
    return result


@router.get("/me", response_model=schemas.PatientProfileResponse)
def get_my_profile(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """Customer — retrieve own health profile."""
    profile = crud.get_profile(db, current_user.id)
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile


@router.put("/me", response_model=schemas.PatientProfileResponse)
def update_my_profile(
    data: schemas.PatientProfileUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """Customer — update own health profile."""
    return crud.upsert_profile(db, current_user.id, data)
