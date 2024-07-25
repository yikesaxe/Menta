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
    clubs: Optional[List[str]] = []
    followers: Optional[List[str]] = []
    following: Optional[List[str]] = []

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
    clubs: Optional[List[str]] = []
    followers: Optional[List[str]] = []
    following: Optional[List[str]] = []

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class Comment(BaseModel):
    user_id: str
    text: str
    timestamp: datetime

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
    comments: Optional[List[Comment]] = []

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
    comments: Optional[List[Comment]] = []
    created_at: datetime
    updated_at: datetime

class Progress(BaseModel):
    user_id: str
    activity: str
    streak: int
    last_completed: datetime
    total_time_spent: int  # in minutes
    created_at: datetime
    updated_at: datetime

class ProgressOut(BaseModel):
    id: str
    user_id: str
    activity: str
    streak: int
    last_completed: datetime
    total_time_spent: int  # in minutes
    created_at: datetime
    updated_at: datetime
