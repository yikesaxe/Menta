import motor.motor_asyncio
from bson import ObjectId
from decouple import config

MONGO_DETAILS = config("MONGO_DETAILS")

client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_DETAILS)
database = client["menta"]

user_collection = database.get_collection("users")

def user_helper(user) -> dict:
    return {
        "id": str(user["_id"]),
        "first_name": user["first_name"],
        "last_name": user["last_name"],
        "email": user["email"],
        "dob": user.get("dob"),  # Use get to avoid KeyError if field is missing
        "interests": user["interests"],
        "profile_picture": user.get("profile_picture"),  # Use get to avoid KeyError if field is missing
        "location": user.get("location"),  # Use get to avoid KeyError if field is missing
        "bio": user.get("bio"),  # Use get to avoid KeyError if field is missing
        "hashed_password": user["hashed_password"],
        "created_at": user["created_at"],
        "updated_at": user["updated_at"],
    }