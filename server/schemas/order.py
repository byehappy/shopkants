from typing import List
from pydantic import BaseModel
from datetime import datetime


class OrderBase(BaseModel):
    user_id: int
    order_date: datetime
    total_amount: float


class OrderCreate(OrderBase):
    pass


class OrderUpdate(OrderBase):
    pass


class OrderInDB(OrderBase):
    id: int


class OrderOut(OrderInDB):
    pass

    class Config:
        orm_mode = True


class OrderStatusBase(BaseModel):
    status: str
    order_id: int
    status_date: datetime = datetime.now()


class OrderStatusCreate(OrderStatusBase):
    pass

    class Config:
        orm_mode = True


class OrderStatusUpdate(OrderStatusBase):
    pass


class OrderStatusOut(OrderStatusBase):
    id: int

    class Config:
        orm_mode = True


class OrderItemBase(BaseModel):
    quantity: int
    price: float


class OrderItemCreate(OrderItemBase):
    order_id: int
    product_id: int


class OrderItemUpdate(OrderItemBase):
    pass


class OrderItemOut(OrderItemBase):
    id: int
    order_id: int
    product_id: int

    class Config:
        orm_mode = True


class OrderDetailOut(OrderOut):
    order_status: List[OrderStatusOut]
    order_items: List[OrderItemOut]

    class Config:
        orm_mode = True


class OrderDetailCreate(OrderCreate):
    order_items: List[OrderItemCreate]


class OrderDetailUpdate(OrderUpdate):
    order_items: List[OrderItemUpdate]
