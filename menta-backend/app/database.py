import motor.motor_asyncio
from bson import ObjectId
from decouple import config
import certifi

MONGO_DETAILS = config("MONGO_DETAILS")

client = motor.motor_asyncio.AsyncIOMotorClient(
    MONGO_DETAILS,
    serverSelectionTimeoutMS=50000, 
    socketTimeoutMS=50000, 
    connectTimeoutMS=50000,  
    tlsCAFile=certifi.where() 
)
database = client["menta"]

user_collection = database.get_collection("users")

def user_helper(user) -> dict:
    return {
        "id": str(user["_id"]),
        "first_name": user["first_name"],
        "last_name": user["last_name"],
        "email": user["email"],
        "dob": user.get("dob"),  
        "interests": user["interests"],
        "profile_picture": user.get("profile_picture"), 
        "location": user.get("location"), 
        "bio": user.get("bio"),  
        "hashed_password": user["hashed_password"],
        "created_at": user["created_at"],
        "updated_at": user["updated_at"],
    }