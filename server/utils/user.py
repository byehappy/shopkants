from sqlalchemy.orm import Session
from models.users import Users

class UserService:
    def __init__(self):
        pass

    def get_user_by_username(self, username: str, db: Session) -> Users:
        return db.query(Users).filter(Users.username == username).first()

