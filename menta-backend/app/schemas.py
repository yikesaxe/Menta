from pydantic import BaseModel, EmailStr
from typing import Optional

class UserCreate(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    password: str
    dob: str
    interests: str
    profile_picture: Optional[str]
    location: Optional[str]
    bio: Optional[str]

class UserOut(BaseModel):
    id: str
    first_name: str
    last_name: str
    email: EmailStr
    dob: str
    interests: str
    profile_picture: Optional[str]
    location: Optional[str]
    bio: Optional[str]

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None