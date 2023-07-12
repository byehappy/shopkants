from sqlalchemy import Column, Integer, String, Text

from config.db import Base


class StoreAddress(Base):
    __tablename__ = "store_addresses"

    id = Column(Integer, primary_key=True)
    address = Column(String(255))
    city = Column(String(255))
    postal_code = Column(String(20))

class ShippingMethod(Base):
    __tablename__ = "shipping_methods"

    id = Column(Integer, primary_key=True)
    name = Column(String(255))
    description = Column(Text)
