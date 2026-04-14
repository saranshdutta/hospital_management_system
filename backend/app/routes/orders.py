from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .. import crud, schemas
from ..auth import get_current_user, require_admin
from ..database import get_db
from ..models import UserRole

router = APIRouter(prefix="/orders", tags=["Orders"])


@router.post("", response_model=schemas.OrderResponse, status_code=status.HTTP_201_CREATED)
def place_order(
    data: schemas.OrderCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """Customer — place a new order."""
    try:
        order = crud.create_order(db, current_user.id, data)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

    response = schemas.OrderResponse.model_validate(order)
    response.user_name = current_user.name
    response.user_email = current_user.email
    return response


@router.get("", response_model=List[schemas.OrderResponse])
def get_orders(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """Customer sees own orders; admin sees all orders."""
    if current_user.role == UserRole.admin:
        orders = crud.get_all_orders(db)
    else:
        orders = crud.get_orders_for_user(db, current_user.id)

    result = []
    for order in orders:
        r = schemas.OrderResponse.model_validate(order)
        r.user_name = order.user.name if order.user else None
        r.user_email = order.user.email if order.user else None
        result.append(r)
    return result


@router.put("/{order_id}/status", response_model=schemas.OrderResponse)
def update_order_status(
    order_id: int,
    data: schemas.OrderStatusUpdate,
    db: Session = Depends(get_db),
    _admin=Depends(require_admin),
):
    """Admin only — update order status."""
    order = crud.update_order_status(db, order_id, data.status)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    r = schemas.OrderResponse.model_validate(order)
    r.user_name = order.user.name if order.user else None
    r.user_email = order.user.email if order.user else None
    return r
