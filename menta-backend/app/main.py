from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta, datetime
import logging

from pydantic import BaseModel
from app.schemas import UserCreate, UserOut, Token, ActivityCreate, ActivityOut
from app.crud import create_user, authenticate_user, create_activity
from app.auth import create_access_token, get_current_user
from app.utils import get_user_by_email
from decouple import config

ACCESS_TOKEN_EXPIRE_MINUTES = 30  # 30 minutes

app = FastAPI()

origins = [
    "http://localhost:3000",  # React app runs on port 3000 by default
    "http://localhost:5173",  # Vite app runs on port 5173 by default
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
