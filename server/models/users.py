from datetime import datetime

from sqlalchemy import Column, Integer, String, TIMESTAMP, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from config.db import Base


class Users(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    username = Column(String(255))
    password = Column(String(255))
    email = Column(String(255))
    created_at = Column(TIMESTAMP)
    rights = Column(String(255))
    activation = Column(Boolean)

# Связи между таблицами
    userdetails = relationship("UserDetail", back_populates="users")
    cart = relationship("Cart", back_populates="users")
    wishlist = relationship("Wishlist", back_populates="users")
    token = relationship("UserToken", back_populates="users")
    orders = relationship("Order", back_populates="users")


class UserDetail(Base):
    __tablename__ = 'userdetails'
    id = Column(Integer, primary_key=True)
    full_name = Column(String(255))
    address = Column(String(255))
    phone = Column(String(20))
    user_id = Column(Integer, ForeignKey('users.id'))

    users = relationship("Users", back_populates="userdetails")


class Cart(Base):
    __tablename__ = "cart"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    product_id = Column(Integer, ForeignKey("products.id"))
    quantity = Column(Integer)

    users = relationship("Users", back_populates="cart")
    product = relationship("Product", back_populates="cart")


class Wishlist(Base):
    __tablename__ = "wishlist"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    product_id = Column(Integer, ForeignKey("products.id"))

    users = relationship("Users", back_populates="wishlist")
    product = relationship("Product", back_populates="wishlist")


class UserToken(Base):
    __tablename__ = "usertoken"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    token = Column(String)
    expires_at = Column(TIMESTAMP, default=datetime.now)

    users = relationship("Users", back_populates="token")

