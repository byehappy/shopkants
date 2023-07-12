from datetime import datetime

from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Numeric, Boolean, TIMESTAMP, DECIMAL
from sqlalchemy.orm import relationship
from config.db import Base


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    order_date = Column(TIMESTAMP)
    total_amount = Column(DECIMAL(10, 2))

    users = relationship("Users", back_populates="orders")
    order_status = relationship("OrderStatus", back_populates="order")


class OrderStatus(Base):
    __tablename__ = 'order_status'

    id = Column(Integer, primary_key=True, autoincrement=True)
    order_id = Column(Integer, ForeignKey('orders.id'))
    status = Column(String(255))
    status_date = Column(TIMESTAMP, default=datetime.now())

    order = relationship("Order", back_populates="order_status")


class OrderItem(Base):
    __tablename__ = 'order_items'

    id = Column(Integer, primary_key=True, autoincrement=True)
    order_id = Column(Integer, ForeignKey('orders.id'))
    product_id = Column(Integer, ForeignKey('products.id'))
    quantity = Column(Integer)
    price = Column(Numeric(10, 2))
