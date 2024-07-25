from app.database import user_collection, user_helper, activity_collection, activity_helper, progress_collection, progress_helper
from app.auth import get_password_hash, verify_password
from datetime import datetime, timedelta
from app.utils import get_user_by_email
from bson import ObjectId

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

    # Update or create progress
    existing_progress = await progress_collection.find_one({"user_id": user_id, "activity": activity_data["activity"]})
    if existing_progress:
        updated_streak = existing_progress["streak"] + 1
        updated_time_spent = existing_progress["total_time_spent"] + activity_data["duration"] // 60
        await progress_collection.update_one(
            {"_id": existing_progress["_id"]},
            {"$set": {
                "streak": updated_streak,
                "last_completed": datetime.utcnow(),
                "total_time_spent": updated_time_spent,
                "updated_at": datetime.utcnow()
            }}
        )
    else:
        new_progress = {
            "user_id": user_id,
            "activity": activity_data["activity"],
            "streak": 1,
            "last_completed": datetime.utcnow(),
            "total_time_spent": activity_data["duration"] // 60,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        await progress_collection.insert_one(new_progress)

    return activity_helper(created_activity)

async def add_comment_to_activity(activity_id: str, comment: dict):
    comment["timestamp"] = datetime.utcnow()
    result = await activity_collection.update_one(
        {"_id": ObjectId(activity_id)},
        {"$push": {"comments": comment}}
    )
    if result.modified_count == 1:
        updated_activity = await activity_collection.find_one({"_id": ObjectId(activity_id)})
        return activity_helper(updated_activity)
    return None

async def update_user(user_id, updated_data):
    result = await user_collection.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": updated_data}
    )
    if result.modified_count == 1:
        updated_user = await user_collection.find_one({"_id": ObjectId(user_id)})
        return user_helper(updated_user)
    return None
