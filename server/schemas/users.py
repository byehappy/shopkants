from datetime import datetime
from pydantic import BaseModel, EmailStr
from typing import Dict, Optional

from models.users import Cart, Wishlist


class UserCreate(BaseModel):
    username: str
    password: str
    email: EmailStr
    rights: str = 'user'
    activation: bool = False
    created_at: datetime = datetime.now()


class UserLogin(BaseModel):
    username: str
    password: str


class UserUpdate(BaseModel):
    username: str = None
    password: str = None
    email: EmailStr = None
    rights: str = None
    activation: bool = None
    created_at: datetime = datetime.now()


class UserInDB(UserCreate):
    id: int


class User(UserInDB):
    class Config:
        orm_mode = True


class CartCreate(BaseModel):
    user_id: int
    items: Dict[int, int]  # Словарь, где ключ - идентификатор товара, значение - количество товара


class CartItemUpdate(BaseModel):
    product_id: int
    user_id: int
    quantity: int


class CartInDB(Cart):
    class Config:
        orm_mode = True


class WishlistCreate(BaseModel):
    user_id: int
    product_id: int


class WishlistInDB(Wishlist):
    class Config:
        orm_mode = True


class UserTokenCreate(BaseModel):
    user_id: int
    token: str


class UserTokenInDB(BaseModel):
    id: int
    user_id: int
    token: str

    class Config:
        orm_mode = True


class UserDetailCreate(BaseModel):
    user_id: int
    full_name: str
    address: str
    phone: str


class UserDetailUpdate(BaseModel):
    full_name: str
    address: str
    phone: str


class UserTokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    user: UserInDB


class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    rights: str
    activation: bool
    created_at: Optional[datetime]
