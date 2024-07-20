from fastapi import FastAPI, Depends, HTTPException, logger, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta
from app.schemas import UserCreate, UserOut, Token
from app.crud import create_user, authenticate_user
from app.auth import create_access_token, get_current_user
from app.utils import get_user_by_email
from decouple import config

# Define the token expiration time
ACCESS_TOKEN_EXPIRE_MINUTES = 30  # 30 minutes

app = FastAPI()

# Set up CORS middleware
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

@app.post("/register", response_model=UserOut)
async def register_user(user: UserCreate):
    try:
        existing_user = await get_user_by_email(user.email)
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")
        new_user = await create_user(user.dict())
        return new_user
    except HTTPException as e:
        # Reraise the HTTPException to ensure correct status code is sent
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