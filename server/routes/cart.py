from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from config.db import SessionLocal
from models.users import Cart
from schemas.users import CartCreate, CartItemUpdate

router = APIRouter()


def get_database_session():
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()


@router.post("/cart", tags=["cart"])
def add_to_cart(cart: CartCreate, db: Session = Depends(get_database_session)):
    for product_id, quantity in cart.items.items():
        new_cart = Cart(user_id=cart.user_id, product_id=product_id, quantity=quantity)
        db.add(new_cart)
    db.commit()
    return {"message": "Cart items added successfully"}


@router.get("/cart/{user_id}", tags=["cart"])
def get_cart(user_id: int, db: Session = Depends(get_database_session)):
    cart_items = db.query(Cart).filter(Cart.user_id == user_id).all()
    if not cart_items:
        raise HTTPException(status_code=404, detail="Cart not found")
    return cart_items


@router.put("/cart/{user_id}", tags=["cart"])
def update_cart_item(user_id: int, cart_item: CartItemUpdate, db: Session = Depends(get_database_session)):
    existing_cart_item = db.query(Cart).filter(Cart.user_id == user_id, Cart.product_id == cart_item.product_id).first()
    if not existing_cart_item:
        raise HTTPException(status_code=404, detail="Cart item not found")
    existing_cart_item.quantity = cart_item.quantity
    db.commit()
    db.refresh(existing_cart_item)
    return existing_cart_item


@router.delete("/cart/{user_id}", tags=["cart"])
def delete_cart(user_id: int, db: Session = Depends(get_database_session)):
    # Find the user's cart
    cart = db.query(Cart).filter(Cart.user_id == user_id).first()
    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")

    # Delete the cart items
    db.query(Cart).filter(Cart.user_id == user_id).delete()

    db.commit()
    return {"message": "Cart items deleted successfully"}


@router.delete("/cart/{user_id}/remove-item/{item_id}", tags=["cart"])
def remove_item_from_cart(user_id: int, item_id: int, db: Session = Depends(get_database_session)):
    # Find the user's cart
    cart = db.query(Cart).filter(Cart.user_id == user_id).first()
    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")

    # Find the item in the cart by item_id
    cart_item = db.query(Cart).filter(Cart.user_id == user_id, Cart.product_id == item_id).first()
    if not cart_item:
        raise HTTPException(status_code=404, detail="Item not found in cart")

    # Delete the item from the cart
    db.delete(cart_item)
    db.commit()

    return {"message": "Item removed from cart successfully"}
