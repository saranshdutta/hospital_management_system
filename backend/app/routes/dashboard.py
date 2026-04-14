from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .. import crud, schemas
from ..auth import require_admin
from ..database import get_db

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get("/stats", response_model=schemas.AdminStatsResponse)
def get_admin_stats(
    db: Session = Depends(get_db),
    _admin=Depends(require_admin),
):
    """Admin only — get dashboard KPI stats."""
    return crud.get_admin_stats(db)
