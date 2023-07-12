from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from config.db import SessionLocal
from schemas.users import WishlistCreate
from models.users import Wishlist

router = APIRouter()


def get_database_session():
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()


@router.post("/wishlist", tags=["wishlist"])
def create_wishlist(wishlist: WishlistCreate, db: Session = Depends(get_database_session)):
    new_wishlist = Wishlist(**wishlist.dict())
    db.add(new_wishlist)
    db.commit()
    db.refresh(new_wishlist)
    return new_wishlist


@router.get("/wishlist/{user_id}", tags=["wishlist"])
def get_wishlist(user_id: int, db: Session = Depends(get_database_session)):
    wishlist = db.query(Wishlist).filter(Wishlist.user_id == user_id).all()
    if not wishlist:
        raise HTTPException(status_code=404, detail="Wishlist not found")
    return wishlist


@router.put("/wishlist/{user_id}", tags=["wishlist"])
def update_wishlist(user_id: int, wishlist: WishlistCreate, db: Session = Depends(get_database_session)):
    existing_wishlist = db.query(Wishlist).filter(Wishlist.user_id == user_id).first()
    if not existing_wishlist:
        raise HTTPException(status_code=404, detail="Wishlist not found")
    for field, value in wishlist.dict().items():
        setattr(existing_wishlist, field, value)
    db.commit()
    db.refresh(existing_wishlist)
    return existing_wishlist


@router.delete("/wishlist/{user_id}/{product_id}", tags=["wishlist"])
def delete_wishlist(user_id: int, product_id: int, db: Session = Depends(get_database_session)):
    wishlist = db.query(Wishlist).filter(Wishlist.user_id == user_id, Wishlist.product_id == product_id).first()
    if not wishlist:
        raise HTTPException(status_code=404, detail="Wishlist not found")
    db.delete(wishlist)
    db.commit()
    return {"message": "Wishlist deleted successfully"}

