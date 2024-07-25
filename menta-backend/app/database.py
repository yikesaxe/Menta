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
activity_collection = database.get_collection("activities")
progress_collection = database.get_collection("progress")

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
        "clubs": user.get("clubs", []),
        "followers": user.get("followers", []),
        "following": user.get("following", []),
        "hashed_password": user["hashed_password"],
        "created_at": user["created_at"],
        "updated_at": user["updated_at"],
    }

def activity_helper(activity) -> dict:
    return {
        "id": str(activity["_id"]),
        "title": activity["title"],
        "description": activity["description"],
        "activity": activity["activity"],
        "date": activity["date"],
        "start_time": activity["start_time"],
        "end_time": activity["end_time"],
        "duration": activity["duration"],
        "private_notes": activity["private_notes"],
        "privacy_type": activity["privacy_type"],
        "perceived_performance": activity["perceived_performance"],
        "images": activity["images"],
        "user_id": activity["user_id"],
        "created_at": activity["created_at"],
        "updated_at": activity["updated_at"],
        "comments": activity.get("comments", [])
    }

def progress_helper(progress) -> dict:
    return {
        "id": str(progress["_id"]),
        "user_id": progress["user_id"],
        "activity": progress["activity"],
        "streak": progress["streak"],
        "last_completed": progress["last_completed"],
        "total_completed": progress["total_completed"],
        "time_spent": progress["time_spent"],  # Time spent on this activity in minutes
        "created_at": progress["created_at"],
        "updated_at": progress["updated_at"],
    }
