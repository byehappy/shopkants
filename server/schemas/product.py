from datetime import datetime
from decimal import Decimal
from typing import List

from pydantic import BaseModel


class CategoryBase(BaseModel):
    name: str
    description: str
    image_url: str


class CategoryCreate(CategoryBase):
    pass


class Category(CategoryBase):
    id: int

    class Config:
        orm_mode = True


class BrandBase(BaseModel):
    name: str
    description: str


class BrandCreate(BrandBase):
    pass


class Brand(BrandBase):
    id: int

    class Config:
        orm_mode = True


class ProductAttributeBase(BaseModel):
    attribute_key: str
    attribute_value: str


class ProductAttributeCreate(ProductAttributeBase):
    pass


class ProductAttributeUpdate(ProductAttributeBase):
    pass


class ProductAttribute(ProductAttributeBase):
    id: int
    product_id: int

    class Config:
        orm_mode = True


class StockBase(BaseModel):
    warehouse_name: str
    quantity: int
    last_updated: datetime


class StockCreate(StockBase):
    pass


class Stock(StockBase):
    id: int
    product_id: int

    class Config:
        orm_mode = True


class ProductBase(BaseModel):
    category_id: int
    name: str
    description: str
    price: Decimal
    quantity: int
    image_url: str
    brand_id: int


class ProductCreate(ProductBase):
    pass


class ProductUpdate(ProductBase):
    pass


class Product(ProductBase):
    id: int
    created_at: datetime
    category: Category
    brand: Brand
    attributes: List[ProductAttribute]
    stock: List[Stock]

    class Config:
        orm_mode = True
