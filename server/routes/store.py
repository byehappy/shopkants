from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from config.db import SessionLocal
from schemas.shop import (
    StoreAddressCreate, StoreAddressUpdate, StoreAddress,
    ShippingMethodCreate, ShippingMethodUpdate, ShippingMethod
)
from models.shop import StoreAddress as StoreAddressModel, ShippingMethod as ShippingMethodModel

router = APIRouter()


def get_database_session():
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()


@router.post("/store_addresses", response_model=StoreAddress, tags=["store_address"])
def create_store_address(store_address: StoreAddressCreate, db: Session = Depends(get_database_session)):
    new_store_address = StoreAddressModel(**store_address.dict())
    db.add(new_store_address)
    db.commit()
    db.refresh(new_store_address)
    return new_store_address


@router.get("/store_addresses/{store_address_id}", response_model=StoreAddress, tags=["store_address"])
def get_store_address(store_address_id: int, db: Session = Depends(get_database_session)):
    store_address = db.query(StoreAddressModel).filter(StoreAddressModel.id == store_address_id).first()
    if not store_address:
        raise HTTPException(status_code=404, detail="Store address not found")
    return store_address


@router.put("/store_addresses/{store_address_id}", response_model=StoreAddress, tags=["store_address"])
def update_store_address(store_address_id: int, store_address: StoreAddressUpdate,
                         db: Session = Depends(get_database_session)):
    existing_store_address = db.query(StoreAddressModel).filter(StoreAddressModel.id == store_address_id).first()
    if not existing_store_address:
        raise HTTPException(status_code=404, detail="Store address not found")
    for field, value in store_address.dict().items():
        setattr(existing_store_address, field, value)
    db.commit()
    db.refresh(existing_store_address)
    return existing_store_address


@router.post("/shipping_methods", response_model=ShippingMethod, tags=["shipping_method"])
def create_shipping_method(shipping_method: ShippingMethodCreate, db: Session = Depends(get_database_session)):
    new_shipping_method = ShippingMethodModel(**shipping_method.dict())
    db.add(new_shipping_method)
    db.commit()
    db.refresh(new_shipping_method)
    return new_shipping_method


@router.get("/shipping_methods/{shipping_method_id}", response_model=ShippingMethod, tags=["shipping_method"])
def get_shipping_method(shipping_method_id: int, db: Session = Depends(get_database_session)):
    shipping_method = db.query(ShippingMethodModel).filter(ShippingMethodModel.id == shipping_method_id).first()
    if not shipping_method:
        raise HTTPException(status_code=404, detail="Shipping method not found")
    return shipping_method


@router.put("/shipping_methods/{shipping_method_id}", response_model=ShippingMethod, tags=["shipping_method"])
def update_shipping_method(shipping_method_id: int, shipping_method: ShippingMethodUpdate,
                           db: Session = Depends(get_database_session)):
    existing_shipping_method = db.query(ShippingMethodModel).filter(
        ShippingMethodModel.id == shipping_method_id).first()
    if not existing_shipping_method:
        raise HTTPException(status_code=404, detail="Shipping method not found")
    for field, value in shipping_method.dict().items():
        setattr(existing_shipping_method, field, value)
    db.commit()
    db.refresh(existing_shipping_method)
    return existing_shipping_method


@router.delete("/store_addresses/{store_address_id}", tags=["store_address"])
def delete_store_address(store_address_id: int, db: Session = Depends(get_database_session)):
    store_address = db.query(StoreAddressModel).filter(StoreAddressModel.id == store_address_id).first()
    if not store_address:
        raise HTTPException(status_code=404, detail="Store address not found")
    db.delete(store_address)
    db.commit()
    return {"message": "Store address deleted successfully"}


@router.delete("/shipping_methods/{shipping_method_id}", tags=["shipping_method"])
def delete_shipping_method(shipping_method_id: int, db: Session = Depends(get_database_session)):
    shipping_method = db.query(ShippingMethodModel).filter(ShippingMethodModel.id == shipping_method_id).first()
    if not shipping_method:
        raise HTTPException(status_code=404, detail="Shipping method not found")
    db.delete(shipping_method)
    db.commit()
    return {"message": "Shipping method deleted successfully"}
