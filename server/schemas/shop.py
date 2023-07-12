from pydantic import BaseModel


class StoreAddressBase(BaseModel):
    address: str
    city: str
    postal_code: str


class StoreAddressCreate(StoreAddressBase):
    pass


class StoreAddressUpdate(StoreAddressBase):
    pass


class StoreAddress(StoreAddressBase):
    id: int

    class Config:
        orm_mode = True


class ShippingMethodBase(BaseModel):
    name: str
    description: str


class ShippingMethodCreate(ShippingMethodBase):
    pass


class ShippingMethodUpdate(ShippingMethodBase):
    pass


class ShippingMethod(ShippingMethodBase):
    id: int

    class Config:
        orm_mode = True
