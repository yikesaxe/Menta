import os
from fastapi import FastAPI, Depends, File, Form, HTTPException, UploadFile, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta, datetime
from typing import List
from pydantic import BaseModel
from app.schemas import Comment, UserCreate, UserOut, Token, ActivityCreate, ActivityOut, ProgressOut
from app.crud import add_comment_to_activity, create_user, authenticate_user, create_activity, update_user
from app.auth import create_access_token, get_current_user
from app.utils import get_user_by_email, get_user_by_id
from app.database import activity_collection, progress_collection, progress_helper, activity_helper
from decouple import config
import logging
import requests
from fastapi.staticfiles import StaticFiles
import boto3
import uuid

ACCESS_TOKEN_EXPIRE_MINUTES = 30  # 30 minutes

app = FastAPI()

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

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
    except requests.RequestException as e:
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
    if (existing_user):
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

@app.get("/users/{user_id}", response_model=UserOut)
async def get_user(user_id: str, current_user: UserOut = Depends(get_current_user)):
    try:
        user = await get_user_by_id(user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return user
    except HTTPException as e:
        logger.error(f"HTTPException in get_user: {e.detail}")
        raise e
    except Exception as e:
        logger.error(f"Exception in get_user: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@app.put("/users/{user_id}", response_model=UserOut)
async def update_user_profile(
    user_id: str,
    first_name: str = Form(...),
    last_name: str = Form(...),
    email: str = Form(...),
    dob: str = Form(...),
    interests: str = Form(...),
    profile_picture: str = Form(None),
    location: str = Form(None),
    bio: str = Form(None),
    cover_photo: str = Form(None),
    current_user: UserOut = Depends(get_current_user)
):
    if current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to update this user")

    updated_data = {
        "first_name": first_name,
        "last_name": last_name,
        "email": email,
        "dob": dob,
        "interests": interests.split(","),
        "profile_picture": profile_picture,
        "location": location,
        "bio": bio,
        "cover_photo": cover_photo,
        "updated_at": datetime.utcnow()
    }

    logger.info(f"Received update request for user: {user_id} with data: {updated_data}")  # Logging for update

    updated_user = await update_user(user_id, updated_data)
    if updated_user:
        return updated_user
    raise HTTPException(status_code=400, detail="Unable to update user profile")

@app.post("/activities", response_model=ActivityOut)
async def upload_activity(
    title: str = Form(...),
    description: str = Form(...),
    activity: str = Form(...),
    date: str = Form(...),
    start_time: str = Form(...),
    duration: int = Form(...),
    private_notes: str = Form(...),
    privacy_type: str = Form(...),
    perceived_performance: int = Form(...),
    files: List[UploadFile] = File(...),
    current_user: UserOut = Depends(get_current_user)
):
    try:
        # Calculate end time
        start_datetime = datetime.strptime(f"{date} {start_time}", "%Y-%m-%d %H:%M")
        end_time = start_datetime + timedelta(seconds=duration)

        image_urls = []
        s3 = boto3.client(
            "s3",
            aws_access_key_id=config("AWS_ACCESS_KEY_ID"),
            aws_secret_access_key=config("AWS_SECRET_ACCESS_KEY"),
            region_name=config("AWS_DEFAULT_REGION")
        )
        BUCKET_NAME = config("S3_BUCKET_NAME")

        for file in files:
            file_extension = file.filename.split(".")[-1]
            file_key = f"{uuid.uuid4()}.{file_extension}"
            s3.upload_fileobj(file.file, BUCKET_NAME, file_key, ExtraArgs={"ContentType": file.content_type})
            image_urls.append(f"https://{BUCKET_NAME}.s3.amazonaws.com/{file_key}")

        activity_data = {
            "title": title,
            "description": description,
            "activity": activity,
            "date": date,
            "start_time": start_time,
            "end_time": end_time.isoformat(),
            "duration": duration,
            "private_notes": private_notes,
            "privacy_type": privacy_type,
            "perceived_performance": perceived_performance,
            "images": image_urls
        }

        new_activity = await create_activity(activity_data, current_user.id)
        return new_activity
    except Exception as e:
        logger.error(f"Error in upload_activity: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@app.post("/upload-images", response_model=List[str])
async def upload_images(files: List[UploadFile] = File(...)):
    try:
        image_urls = []
        s3 = boto3.client(
            "s3",
            aws_access_key_id=config("AWS_ACCESS_KEY_ID"),
            aws_secret_access_key=config("AWS_SECRET_ACCESS_KEY"),
            region_name=config("AWS_DEFAULT_REGION")
        )
        BUCKET_NAME = config("S3_BUCKET_NAME")
        for file in files:
            file_extension = file.filename.split(".")[-1]
            file_key = f"{uuid.uuid4()}.{file_extension}"
            s3.upload_fileobj(file.file, BUCKET_NAME, file_key, ExtraArgs={"ContentType": file.content_type})
            image_urls.append(f"https://{BUCKET_NAME}.s3.amazonaws.com/{file_key}")
        return image_urls
    except Exception as e:
        logger.error(f"Error uploading file: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@app.get("/activities", response_model=List[ActivityOut])
async def get_activities(current_user: UserOut = Depends(get_current_user)):
    try:
        activities = await activity_collection.find().sort("created_at", -1).to_list(100)
        return [activity_helper(activity) for activity in activities]
    except Exception as e:
        logger.error(f"Error in get_activities: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@app.post("/activities/{activity_id}/comments", response_model=ActivityOut)
async def add_comment(activity_id: str, comment: Comment, current_user: UserOut = Depends(get_current_user)):
    comment_data = comment.dict()
    comment_data["user_id"] = current_user.id
    updated_activity = await add_comment_to_activity(activity_id, comment_data)
    if updated_activity:
        return updated_activity
    raise HTTPException(status_code=400, detail="Unable to add comment")

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

        if not progress_entries:
            return []

        activity_summary = {}

        for entry in progress_entries:
            activity = entry['activity']
            if activity not in activity_summary:
                activity_summary[activity] = {
                    "streak": 0,
                    "total_time_spent": 0,
                    "last_completed": None
                }
            activity_summary[activity]["streak"] = max(activity_summary[activity]["streak"], entry['streak'])
            activity_summary[activity]["total_time_spent"] += entry['total_time_spent']
            if activity_summary[activity]["last_completed"] is None or entry['last_completed'] > activity_summary[activity]["last_completed"]:
                activity_summary[activity]["last_completed"] = entry['last_completed']

        progress_out_list = []
        for activity, summary in activity_summary.items():
            progress_out_list.append(ProgressOut(
                id=str(uuid.uuid4()),
                user_id=user_id,
                activity=activity,
                streak=summary["streak"],
                total_time_spent=summary["total_time_spent"],
                last_completed=summary["last_completed"],
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            ))

        return progress_out_list

    except Exception as e:
        logger.error(f"Error in get_user_progress: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

