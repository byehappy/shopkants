from sqlalchemy import Column, ForeignKey, Integer, String, Text, DateTime, Numeric, TIMESTAMP
from sqlalchemy.orm import relationship

from config.db import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, autoincrement=True)
    category_id = Column(Integer, ForeignKey("categories.id"))
    name = Column(String(255))
    description = Column(Text)
    price = Column(Numeric(10, 2))
    quantity = Column(Integer)
    image_url = Column(String(255))
    created_at = Column(DateTime)
    brand_id = Column(Integer, ForeignKey("brands.id"))

    cart = relationship("Cart", back_populates="product")
    wishlist = relationship("Wishlist", back_populates="product")
    category = relationship("Category", back_populates="product")
    brand = relationship("Brand", back_populates="product")
    attributes = relationship("ProductAttribute", back_populates="product")
    stock = relationship("Stock", back_populates="product")


class Brand(Base):
    __tablename__ = "brands"

    id = Column(Integer, primary_key=True)
    name = Column(String(255))
    description = Column(Text)

    product = relationship("Product", back_populates="brand")


class ProductAttribute(Base):
    __tablename__ = "product_attributes"

    id = Column(Integer, primary_key=True)
    product_id = Column(Integer, ForeignKey("products.id"))
    attribute_key = Column(String(255))
    attribute_value = Column(String(255))

    product = relationship("Product", back_populates="attributes")


class Stock(Base):
    __tablename__ = "stock"

    id = Column(Integer, primary_key=True)
    product_id = Column(Integer, ForeignKey("products.id"))
    warehouse_name = Column(String(255))
    quantity = Column(Integer)
    last_updated = Column(TIMESTAMP)

    product = relationship("Product", back_populates="stock")


class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True)
    name = Column(String(255))
    description = Column(Text)
    image_url = Column(String(255))

    product = relationship("Product", back_populates="category")
