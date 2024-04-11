from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime

import schemas.order
from config.db import SessionLocal
from models.order import Order, OrderStatus, OrderItem
from schemas.order import OrderCreate, OrderUpdate, OrderOut, OrderDetailOut, OrderDetailCreate, OrderDetailUpdate, \
    OrderItemCreate, OrderStatusCreate, OrderStatusOut, OrderStatusUpdate

router = APIRouter()


def get_database_session():
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()


# Retrieve a specific order
@router.get("/orders/{order_id}", tags=["orders"], response_model=OrderOut)
def get_order(order_id: int, db: Session = Depends(get_database_session)):
    order = db.query(Order).get(order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@router.get("/orders/get/all", tags=["orders"], response_model=List[schemas.order.OrderOut])
def get_all_orders(db: Session = Depends(get_database_session)):
    orders = db.query(Order).all()
    return orders

@router.get("/orders/user/{user_id}", tags=["orders"])
def get_order(user_id: int, db: Session = Depends(get_database_session)):
    order = db.query(Order).filter_by(user_id=user_id).all()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


# Create a new order
@router.post("/orders", tags=["orders"], response_model=OrderOut)
async def create_order(order: OrderCreate, db: Session = Depends(get_database_session)):
    new_order = Order(
        user_id=order.user_id,
        order_date=datetime.now(),
        total_amount=order.total_amount
    )
    db.add(new_order)
    db.commit()
    db.refresh(new_order)
    return OrderOut.from_orm(new_order)


# Update an existing order
@router.put("/orders/{order_id}", tags=["orders"], response_model=OrderOut)
def update_order(order_id: int, order: OrderUpdate, db: Session = Depends(get_database_session)):
    existing_order = db.query(Order).get(order_id)
    if not existing_order:
        raise HTTPException(status_code=404, detail="Order not found")
    for field, value in order.dict(exclude_unset=True).items():
        setattr(existing_order, field, value)
    db.commit()
    db.refresh(existing_order)
    return existing_order


# Delete an existing order
@router.delete("/orders/{order_id}", tags=["orders"])
def delete_order(order_id: int, db: Session = Depends(get_database_session)):
    order = db.query(Order).get(order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    db.delete(order)
    db.commit()
    return {"message": "Order deleted successfully"}


@router.get("/orders/{order_id}/details", tags=["orders"], response_model=OrderDetailOut)
def get_order_details(order_id: int, db: Session = Depends(get_database_session)):
    order = db.query(Order).get(order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    order_status = db.query(OrderStatus).filter(OrderStatus.order_id == order_id).all()
    order_items = db.query(OrderItem).filter(OrderItem.order_id == order_id).all()

    return OrderDetailOut(
        id=order.id,
        user_id=order.user_id,
        order_date=order.order_date,
        total_amount=order.total_amount,
        order_status=order_status,
        order_items=order_items
    )


@router.post("/orders/{order_id}/details", tags=["orders"], response_model=OrderDetailOut)
def create_order_details(order_id: int, order_details: OrderDetailCreate, db: Session = Depends(get_database_session)):
    order = db.query(Order).get(order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    new_order_status = []
    new_status = OrderStatus(status="new", order_id=order_id)
    db.add(new_status)
    new_order_status.append(new_status)

    new_order_items = []
    for item in order_details.order_items:
        new_item = OrderItem(quantity=item.quantity, price=item.price, product_id=item.product_id, order_id=order_id)
        db.add(new_item)
        new_order_items.append(new_item)

    db.commit()
    db.refresh(order)

    return OrderDetailOut(
        id=order.id,
        user_id=order.user_id,
        order_date=order.order_date,
        total_amount=order.total_amount,
        order_status=new_order_status,
        order_items=new_order_items
    )


@router.put("/orders/{order_id}/details", tags=["orders"], response_model=OrderDetailOut)
def update_order_details(order_id: int, order_details: OrderDetailUpdate, db: Session = Depends(get_database_session)):
    order = db.query(Order).get(order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    for status in order_details.order_status:
        existing_status = db.query(OrderStatus).get(status.id)
        if existing_status:
            for field, value in status.dict(exclude_unset=True).items():
                setattr(existing_status, field, value)
        else:
            new_status = OrderStatus(**status.dict(), order_id=order_id)
            db.add(new_status)

    for item in order_details.order_items:
        existing_item = db.query(OrderItem).get(item.id)
        if existing_item:
            for field, value in item.dict(exclude_unset=True).items():
                setattr(existing_item, field, value)
        else:
            new_item = OrderItem(**item.dict(), order_id=order_id)
            db.add(new_item)

    db.commit()
    db.refresh(order)

    order_status = db.query(OrderStatus).filter(OrderStatus.order_id == order_id).all()
    order_items = db.query(OrderItem).filter(OrderItem.order_id == order_id).all()

    return OrderDetailOut(
        id=order.id,
        user_id=order.user_id,
        order_date=order.order_date,
        total_amount=order.total_amount,
        order_status=order_status,
        order_items=order_items
    )


@router.get("/orders/{order_id}/status", tags=["orders"], response_model=List[OrderStatusOut])
def get_order_statuses(order_id: int, db: Session = Depends(get_database_session)):
    statuses = db.query(OrderStatus).filter(OrderStatus.order_id == order_id).all()
    if not statuses:
        raise HTTPException(status_code=404, detail="Order statuses not found")

    order_status_out_list = []
    for status in statuses:
        order_status_out = OrderStatusOut(
            id=status.id,
            status=status.status,
            order_id=status.order_id,
            status_date=status.status_date
        )
        order_status_out_list.append(order_status_out)

    return order_status_out_list


@router.get("/orders/{order_id}/status", tags=["orders"], response_model=OrderStatusOut)
def get_order_status(order_id: int, db: Session = Depends(get_database_session)):
    status = db.query(OrderStatus).filter(OrderStatus.order_id == order_id).first()
    if not status:
        raise HTTPException(status_code=404, detail="Order status not found")

    order_status_out = OrderStatusOut(
        id=status.id,
        status=status.status,
        order_id=status.order_id,
        status_date=status.status_date
    )
    return order_status_out


@router.post("/orders/{order_id}/status", tags=["orders"], response_model=OrderStatusOut)
def create_order_status(order_id: int, status: OrderStatusCreate, db: Session = Depends(get_database_session)):
    order = db.query(Order).get(order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    new_status = OrderStatus(
        status=status.status,
        order_id=order_id,
        status_date=status.status_date
    )
    db.add(new_status)
    db.commit()
    db.refresh(new_status)

    order_status_out = OrderStatusOut(
        id=new_status.id,
        status=new_status.status,
        order_id=new_status.order_id,
        status_date=new_status.status_date
    )
    return order_status_out


@router.put("/orders/{order_id}/status", tags=["orders"], response_model=OrderStatusOut)
def update_order_status(
        order_id: int,
        status: OrderStatusUpdate,
        db: Session = Depends(get_database_session)
):
    order = db.query(Order).get(order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    existing_status = db.query(OrderStatus).filter(OrderStatus.order_id == order_id).first()
    if not existing_status:
        raise HTTPException(status_code=404, detail="Order status not found")

    for field, value in status.dict(exclude_unset=True).items():
        setattr(existing_status, field, value)

    db.commit()
    db.refresh(existing_status)

    order_status_out = OrderStatusOut(
        id=existing_status.id,
        status=existing_status.status,
        order_id=existing_status.order_id,
        status_date=existing_status.status_date
    )
    return order_status_out


@router.delete("/orders/{order_id}/status", tags=["orders"])
def delete_order_status(order_id: int, db: Session = Depends(get_database_session)):
    order = db.query(Order).get(order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    status = db.query(OrderStatus).filter(OrderStatus.order_id == order_id).first()
    if not status:
        raise HTTPException(status_code=404, detail="Order status not found")

    db.delete(status)
    db.commit()
    return {"message": "Order status deleted successfully"}

@router.patch("/orders/{order_id}/status", tags=["orders"], response_model=schemas.order.OrderStatusOut)
def patch_order_status(order_id: int, status_update: OrderStatusUpdate, db: Session = Depends(get_database_session)):
    # Поиск заказа
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    # Поиск статуса заказа
    order_status = db.query(OrderStatus).filter(OrderStatus.order_id == order_id).first()
    if not order_status:
        raise HTTPException(status_code=404, detail="Order status not found")

    # Обновление статуса заказа
    for field, value in status_update.dict(exclude_unset=True).items():
        setattr(order_status, field, value)

    # Обновление времени изменения статуса заказа
    order_status.status_date = datetime.now()

    db.commit()
    db.refresh(order_status)

    return order_status