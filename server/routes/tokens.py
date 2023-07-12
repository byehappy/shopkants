from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from config.db import SessionLocal
from models.users import UserToken
from schemas.users import UserTokenCreate

router = APIRouter()


def get_database_session():
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()


@router.post("/usertoken", tags=["usertoken"])
async def create_user_token(user_token: UserTokenCreate, db: Session = Depends(get_database_session)):
    new_user_token = UserToken(**user_token.dict())
    db.add(new_user_token)
    db.commit()
    db.refresh(new_user_token)
    return new_user_token


@router.get("/usertoken/{usertoken_id}", tags=["usertoken"])
async def get_user_token(usertoken_id: int, db: Session = Depends(get_database_session)):
    user_token = db.query(UserToken).filter(UserToken.id == usertoken_id).first()
    if not user_token:
        raise HTTPException(status_code=404, detail="User token not found")
    return user_token


@router.get("/usertoken/user/{user_id}", tags=["usertoken"])
async def get_user_tokens(user_id: int, db: Session = Depends(get_database_session)):
    user_tokens = db.query(UserToken).filter(UserToken.user_id == user_id).all()
    return user_tokens


@router.delete("/usertoken/{user_id}", tags=["usertoken"])
async def delete_user_token(user_id: int, db: Session = Depends(get_database_session)):
    user_token = db.query(UserToken).filter(UserToken.user_id == user_id).first()
    if not user_token:
        raise HTTPException(status_code=404, detail="User token not found")
    db.delete(user_token)
    db.commit()
    return {"message": "User token deleted successfully"}
