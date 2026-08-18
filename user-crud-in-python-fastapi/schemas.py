from datetime import datetime
from decimal import Decimal
from typing import Optional
from pydantic import BaseModel, ConfigDict

class ItemCreate(BaseModel):
    title: str
    description: Optional[str] = None
    price: Decimal

class ItemUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    price: Optional[Decimal] = None

class ItemResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    price: Decimal
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)