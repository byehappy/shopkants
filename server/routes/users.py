from datetime import datetime, timezone, timedelta
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Response, Cookie
from sqlalchemy.orm import Session

from config.db import SessionLocal
from models.users import Users, UserDetail
from schemas.users import UserCreate, UserUpdate, UserDetailCreate, UserDetailUpdate, UserTokenResponse, \
    UserResponse, UserLogin
from fastapi.security import OAuth2PasswordRequestForm
import bcrypt

from utils.hasher import get_password_hash, verify_password
from utils.token import TokenService
from utils.user import UserService

router = APIRouter()


def get_database_session():
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()


@router.get("/users/{user_id}", tags=['user'])
async def get_user(user_id: int, db: Session = Depends(get_database_session)):
    user = db.query(Users).filter(Users.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.put("/users/{user_id}", tags=['user'])
async def update_user(user_id: int, user: UserUpdate, db: Session = Depends(get_database_session)):
    # Получение существующего пользователя
    existing_user = db.query(Users).filter(Users.id == user_id).first()
    if not existing_user:
        raise HTTPException(status_code=404, detail="User not found")

    # Хеширование пароля, если он был указан для обновления
    if user.password:
        hashed_password = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt())
        setattr(existing_user, 'password', hashed_password)

    # Обновление остальных полей пользователя
    for field, value in user.dict().items():
        if field != 'password':
            setattr(existing_user, field, value)

    db.commit()
    db.refresh(existing_user)
    return {"msg": "User was changed!", "user": existing_user}


@router.delete("/users/{user_id}", tags=['user'])
async def delete_user(user_id: int, db: Session = Depends(get_database_session)):
    user = db.query(Users).filter(Users.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(user)
    db.commit()
    return {"message": "User deleted successfully"}


@router.post("/registration", tags=['auth'], response_model=UserResponse)
async def create_user(response: Response,
                      user: UserCreate,
                      token_service: TokenService = Depends(),
                      db: Session = Depends(get_database_session)):
    # Check if user with the same username already exists
    existing_user = db.query(Users).filter(Users.username == user.username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")

    # Check if user with the same email already exists
    existing_email = db.query(Users).filter(Users.email == user.email).first()
    if existing_email:
        raise HTTPException(status_code=400, detail="Email already exists")
    # Хеширование пароля
    hashed_password = get_password_hash(user.password)

    # Создание нового пользователя с хешированным паролем
    new_user = Users(
        username=user.username,
        password=hashed_password,
        email=user.email,
        rights=user.rights,
        activation=user.activation,
        created_at=datetime.now()
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    access_token = token_service.generate_tokens({'sub': new_user.username})
    refresh_token = token_service.generate_token_for_email({'sub': new_user.username})

    token_service.save_token(db, new_user.id, refresh_token)
    expires = datetime.now(timezone.utc) + timedelta(minutes=180)
    response.set_cookie(key='refresh_token', value=access_token['refresh_token'],
                        expires=expires)
    return UserResponse(
        id=new_user.id,
        username=new_user.username,
        email=new_user.email,
        rights=new_user.rights,
        activation=new_user.activation,
        created_at=datetime.now()
    )


@router.post('/login', tags=['auth'], response_model=UserTokenResponse)
def login(
        response: Response,
        form: UserLogin,
        db: Session = Depends(get_database_session),
        user_service: UserService = Depends(),
        token_service: TokenService = Depends(),
):
    user = user_service.get_user_by_username(form.username, db)
    if not user or not verify_password(form.password, user.password):
        raise HTTPException(status_code=400, detail='Неверное имя пользователя или пароль')

    access_token = token_service.generate_tokens(str(user.id))
    refresh_token = token_service.generate_token_for_email(str(user.id))

    token_service.save_token(db, user.id, refresh_token)
    expires = datetime.now(timezone.utc) + timedelta(minutes=180)
    response.set_cookie(key='refresh_token', value=access_token['refresh_token'],
                        expires=expires)

    return UserTokenResponse(
        access_token=access_token['access_token'],
        refresh_token=access_token['refresh_token'],
        user={
            'id': user.id,
            'username': user.username,
            'password': user.password,
            'email': user.email,
            'rights': user.rights,
            'activation': user.activation,
        }
    )


@router.get('/refresh', tags=['auth'], response_model=UserResponse)
def refresh_token(
        refresh_token: Optional[str] = Cookie(default=None),
        db: Session = Depends(get_database_session),
        token_service: TokenService = Depends()
):
    if not refresh_token:
        raise HTTPException(status_code=401, detail='Refresh token not found')

    token_data = token_service.find_token(db, refresh_token)
    if not token_data:
        raise HTTPException(status_code=401, detail='Invalid or expired refresh token')

    return UserResponse(
        id=token_data.id,
        username=token_data.username,
        email=token_data.email,
        rights=token_data.rights,
        activation=token_data.activation,
        created_at=token_data.created_at
    )


@router.post('/logout', tags=['auth'])
def logout(response: Response, db: Session = Depends(get_database_session), token_service: TokenService = Depends(),
           refresh_token: str = Cookie()):
    if refresh_token:
        token_service.remove_token(db, refresh_token)

    response.delete_cookie(key='refresh_token', domain='localhost')

    return {'message': 'Logout successful'}


@router.post("/userdetails", tags=["userdetails"])
def create_user_detail(user_detail: UserDetailCreate, db: Session = Depends(get_database_session)):
    new_user_detail = UserDetail(**user_detail.dict())
    db.add(new_user_detail)
    db.commit()
    db.refresh(new_user_detail)
    return new_user_detail


@router.get("/userdetails/{user_id}", tags=["userdetails"], response_model=None)
def get_user_detail(user_id: int, db: Session = Depends(get_database_session)) -> Optional[UserDetail]:
    user_detail = db.query(UserDetail).filter(UserDetail.user_id == user_id).first()
    return user_detail



@router.put("/userdetails/{user_id}", tags=["userdetails"])
def update_user_detail(user_id: int, user_detail: UserDetailUpdate, db: Session = Depends(get_database_session)):
    existing_user_detail = db.query(UserDetail).filter(UserDetail.user_id == user_id).first()
    if not existing_user_detail:
        raise HTTPException(status_code=404, detail="User detail not found")
    for field, value in user_detail.dict().items():
        setattr(existing_user_detail, field, value)
    db.commit()
    db.refresh(existing_user_detail)
    return existing_user_detail


@router.delete("/userdetails/{user_id}", tags=["userdetails"])
def delete_user_detail(user_id: int, db: Session = Depends(get_database_session)):
    user_detail = db.query(UserDetail).filter(UserDetail.user_id == user_id).first()
    if not user_detail:
        raise HTTPException(status_code=404, detail="User detail not found")
    db.delete(user_detail)
    db.commit()
    return {"message": "User detail deleted successfully"}
