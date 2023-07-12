from datetime import datetime, timedelta
from jose import jwt
from sqlalchemy.orm import Session

from config.config import secret_key
from models.users import UserToken, Users
from schemas.users import User


class TokenService:
    def generate_tokens(self, payload):
        access_token = self._generate_token(payload, expires_minutes=180)
        refresh_token = self._generate_token(payload, expires_days=30)

        return {
            'access_token': access_token,
            'refresh_token': refresh_token
        }

    def generate_token_for_email(self, payload):
        return self._generate_token(payload, expires_hours=2)

    def generate_token_for_reset(self, payload):
        return self._generate_token(payload, expires_hours=2)

    def save_token(self, db: Session, user_id, refresh_token):
        user_token = db.query(UserToken).filter_by(user_id=user_id).first()
        if user_token:
            user_token.token = refresh_token
        else:
            user_token = UserToken(user_id=user_id, token=refresh_token)
            db.add(user_token)

        db.commit()

    def validate_token(self, token, secret_key):
        try:
            payload = jwt.decode(token, secret_key, algorithms=['HS256'])
            return payload
        except jwt.JWTError:
            return None

    def remove_token(self, db: Session, refresh_token):
        token_data = jwt.decode(refresh_token, secret_key, algorithms=['HS256'])
        subjects = token_data.get('sub')
        token_data = db.query(UserToken).filter_by(user_id=subjects).delete()
        db.commit()
        return token_data

    def find_token(self, db: Session, refresh_token):
        try:
            if refresh_token:
                token_payload = jwt.decode(refresh_token, secret_key, algorithms=['HS256'])
                subjects = token_payload.get('sub')
                if subjects:
                    token_data = db.query(UserToken).filter_by(user_id=subjects).first()
                    if token_data:
                        user_data = db.query(Users).filter(Users.id == subjects).first()
                        if user_data:
                            return user_data
        except (jwt.JWTError, ValueError):
            pass

    def _generate_token(self, payload, expires_minutes=None, expires_hours=3, expires_days=None):
        now = datetime.utcnow()
        if expires_minutes:
            expires = now + timedelta(minutes=expires_minutes)
        elif expires_hours:
            expires = now + timedelta(hours=expires_hours)
        elif expires_days:
            expires = now + timedelta(days=expires_days)
        else:
            raise ValueError('Expiration time not specified')

        token_payload = {'exp': expires, 'iat': now, 'sub': payload}
        token = jwt.encode(token_payload, secret_key, algorithm='HS256')
        return token
