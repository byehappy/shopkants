from fastapi import FastAPI
import models.users
from config.db import engine
from routes import users, tokens, cart, product, order, wishlist, store
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

models.users.Base.metadata.create_all(bind=engine)

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Маршрутизация
app.include_router(users.router)
app.include_router(tokens.router)
app.include_router(cart.router)
app.include_router(product.router)
app.include_router(order.router)
app.include_router(wishlist.router)
app.include_router(store.router)
