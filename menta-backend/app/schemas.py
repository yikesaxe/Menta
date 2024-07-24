from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class UserCreate(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    password: str
    dob: str
    interests: List[str]  
    profile_picture: Optional[str]
    location: Optional[str]
    bio: Optional[str]

class UserOut(BaseModel):
    id: str
    first_name: str
    last_name: str
    email: EmailStr
    dob: str
    interests: List[str] 
    profile_picture: Optional[str]
    location: Optional[str]
    bio: Optional[str]

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class ActivityCreate(BaseModel):
    title: str
    description: Optional[str]
    activity: str
    date: str
    start_time: str
    duration: int
    private_notes: Optional[str]
    privacy_type: str
    perceived_performance: Optional[int]
    images: Optional[List[str]] = []

class ActivityOut(BaseModel):
    id: str
    title: str
    description: Optional[str]
    activity: str
    date: str
    start_time: str
    end_time: str
    duration: int
    private_notes: Optional[str]
    privacy_type: str
    perceived_performance: Optional[int]
    images: Optional[List[str]] = []
    user_id: str
    created_at: datetime
    updated_at: datetime
