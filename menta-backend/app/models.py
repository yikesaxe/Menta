from bson import ObjectId
from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List
from datetime import datetime

class UserModel(BaseModel):
    id: Optional[str] = Field(alias="_id")
    first_name: str
    last_name: str
    email: EmailStr
    hashed_password: str
    dob: str
    interests: List[str]
    profile_picture: Optional[str] = None
    location: Optional[str] = None
    bio: Optional[str] = None
    clubs: Optional[List[str]] = []
    followers: Optional[List[str]] = []
    following: Optional[List[str]] = []
    created_at: datetime
    updated_at: datetime

    class Config:
        allow_population_by_field_name = True
        json_encoders = {ObjectId: str}
        arbitrary_types_allowed = True

class ActivityModel(BaseModel):
    id: Optional[str] = Field(alias="_id")
    title: str
    description: str
    activity: str
    date: str
    start_time: str
    end_time: str
    duration: int
    private_notes: str
    privacy_type: str
    perceived_performance: int
    images: List[str]
    user_id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        allow_population_by_field_name = True
        json_encoders = {ObjectId: str}
        arbitrary_types_allowed = True

class ProgressModel(BaseModel):
    id: Optional[str] = Field(alias="_id")
    user_id: str
    activity: str
    streak: int
    last_completed: datetime
    total_time_spent: int  # in minutes
    created_at: datetime
    updated_at: datetime

    class Config:
        allow_population_by_field_name = True
        json_encoders = {ObjectId: str}
        arbitrary_types_allowed = True
