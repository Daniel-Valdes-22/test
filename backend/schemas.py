from datetime import datetime

from pydantic import BaseModel, ConfigDict


class LoginRequest(BaseModel):
    username: str
    password: str


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    username: str


class BookOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    author: str
    price: float
    description: str
    owned: bool = False


class PurchaseOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    book_id: int
    purchased_at: datetime
    book: BookOut
