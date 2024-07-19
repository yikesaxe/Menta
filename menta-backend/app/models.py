from bson import ObjectId
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

class UserModel(BaseModel):
    id: Optional[str] = Field(alias="_id")
    first_name: str
    last_name: str
    email: EmailStr
    hashed_password: str
    dob: str
    interests: str
    profile_picture: Optional[str] = None
    location: Optional[str] = None
    bio: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        allow_population_by_field_name = True
        json_encoders = {ObjectId: str}
        arbitrary_types_allowed = True
