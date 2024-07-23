from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta

from pydantic import BaseModel
from app.schemas import UserCreate, UserOut, Token
from app.crud import create_user, authenticate_user
from app.auth import create_access_token, get_current_user
from app.utils import get_user_by_email
from decouple import config

import requests
import logging

ACCESS_TOKEN_EXPIRE_MINUTES = 30  

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

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

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
    try:
        existing_user = await get_user_by_email(email_check.email)
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")
        return {"message": "Email is available"}
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Error in check_email: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@app.post("/register", response_model=UserOut)
async def register_user(user: UserCreate):
    try:
        existing_user = await get_user_by_email(user.email)
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")
        new_user = await create_user(user.dict())
        return new_user
    except HTTPException as e:      
        raise e
    except Exception as e:
        logger.error(f"Error in register_user: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@app.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    try:
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
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Error in login_for_access_token: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@app.get("/users/me", response_model=UserOut)
async def read_users_me(current_user: UserOut = Depends(get_current_user)):
    return current_user
