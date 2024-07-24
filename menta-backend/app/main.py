from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta, datetime
from typing import List
from pydantic import BaseModel
from app.schemas import UserCreate, UserOut, Token, ActivityCreate, ActivityOut, ProgressOut
from app.crud import create_user, authenticate_user, create_activity
from app.auth import create_access_token, get_current_user
from app.utils import get_user_by_email
from app.database import activity_collection, progress_collection, progress_helper, activity_helper
from decouple import config

import logging
import requests

ACCESS_TOKEN_EXPIRE_MINUTES = 30  # 30 minutes

app = FastAPI()

origins = [
    "http://localhost:3000",  
    "http://localhost:5173",  
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logger
logger = logging.getLogger("uvicorn")
logger.setLevel(logging.ERROR)

class EmailCheckRequest(BaseModel):
    email: str

class StudySpotsRequest(BaseModel):
    lat: float
    lon: float
    radius: int = 1000  

def fetch_osm_data(query: str):
    url = "http://overpass-api.de/api/interpreter"
    response = requests.get(url, params={'data': query})
    response.raise_for_status()
    return response.json()

@app.post("/api/study_spots")
async def study_spots(request: StudySpotsRequest):
    lat = request.lat
    lon = request.lon
    radius = request.radius

    query = f"""
    [out:json];
    (
      node["amenity"="cafe"](around:{radius},{lat},{lon});
      node["amenity"="library"](around:{radius},{lat},{lon});
    );
    out body;
    """
    try:
        logger.debug(f"Fetching OSM data with query: {query}")
        data = fetch_osm_data(query)
        logger.debug(f"Received OSM data: {data}")
        return data
    except requests.RequestException as e:  # Corrected exception handling
        logger.error(f"RequestException in study_spots: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error: Unable to fetch data from Overpass API")
    except Exception as e:
        logger.error(f"Exception in study_spots: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@app.post("/check-email")
async def check_email(email_check: EmailCheckRequest):
    existing_user = await get_user_by_email(email_check.email)
    if (existing_user):
        raise HTTPException(status_code=400, detail="Email already registered")
    return {"message": "Email is available"}

@app.post("/register", response_model=UserOut)
async def register_user(user: UserCreate):
    existing_user = await get_user_by_email(user.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    new_user = await create_user(user.dict())
    return new_user

@app.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={"sub": user["email"]}, expires_delta=access_token_expires)
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me", response_model=UserOut)
async def read_users_me(current_user: UserOut = Depends(get_current_user)):
    return current_user

@app.post("/activities", response_model=ActivityOut)
async def upload_activity(activity: ActivityCreate, current_user: UserOut = Depends(get_current_user)):
    try:
        # Calculate end time
        start_datetime = datetime.strptime(f"{activity.date} {activity.start_time}", "%Y-%m-%d %H:%M")
        end_time = start_datetime + timedelta(seconds=activity.duration)
        
        activity_data = activity.dict()
        activity_data["end_time"] = end_time.isoformat()
        new_activity = await create_activity(activity_data, current_user.id)
        return new_activity
    except Exception as e:
        logger.error(f"Error in upload_activity: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@app.get("/activities", response_model=List[ActivityOut])
async def get_activities(current_user: UserOut = Depends(get_current_user)):
    try:
        activities = await activity_collection.find().sort("created_at", -1).to_list(100)
        return [activity_helper(activity) for activity in activities]
    except Exception as e:
        logger.error(f"Error in get_activities: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    
@app.get("/activities/user/{user_id}", response_model=List[ActivityOut])
async def get_user_activities(user_id: str, current_user: UserOut = Depends(get_current_user)):
    try:
        activities = await activity_collection.find({"user_id": user_id}).sort("created_at", -1).to_list(100)
        return [activity_helper(activity) for activity in activities]
    except Exception as e:
        logger.error(f"Error in get_user_activities: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@app.get("/progress/{user_id}", response_model=List[ProgressOut])
async def get_user_progress(user_id: str, current_user: UserOut = Depends(get_current_user)):
    try:
        progress_entries = await progress_collection.find({"user_id": user_id}).to_list(100)
        return [progress_helper(entry) for entry in progress_entries]
    except Exception as e:
        logger.error(f"Error in get_user_progress: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
