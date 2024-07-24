from app.database import user_collection, user_helper, activity_collection, activity_helper
from app.auth import get_password_hash, verify_password
from datetime import datetime, timedelta
from app.utils import get_user_by_email

async def create_user(user_data):
    user_data["hashed_password"] = get_password_hash(user_data["password"])
    user_data.pop("password")
    user_data["created_at"] = datetime.utcnow()
    user_data["updated_at"] = datetime.utcnow()
    new_user = await user_collection.insert_one(user_data)
    created_user = await user_collection.find_one({"_id": new_user.inserted_id})
    return user_helper(created_user)

async def authenticate_user(email: str, password: str):
    user = await get_user_by_email(email)
    print(f"User found: {user}")  # Debugging line
    if not user:
        return False
    if not verify_password(password, user["hashed_password"]):
        return False
    return user

async def create_activity(activity_data, user_id):
    activity_data["user_id"] = user_id
    activity_data["created_at"] = datetime.utcnow()
    activity_data["updated_at"] = datetime.utcnow()
    activity_data["end_time"] = (datetime.strptime(activity_data["start_time"], "%H:%M") + timedelta(minutes=activity_data["duration"])).strftime("%H:%M")
    new_activity = await activity_collection.insert_one(activity_data)
    created_activity = await activity_collection.find_one({"_id": new_activity.inserted_id})
    return activity_helper(created_activity)
