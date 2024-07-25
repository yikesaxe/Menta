from app.database import user_collection, user_helper

async def get_user_by_email(email: str):
    try:
        user = await user_collection.find_one({"email": email})
        if user:
            return user_helper(user)
        return None
    except Exception as e:
        print(f"Error finding user by email: {e}")
        return None
    
async def get_user_by_id(user_id: str):
    from bson import ObjectId

    user = await user_collection.find_one({"_id": ObjectId(user_id)})
    if user is None:
        return None
    
    user["id"] = str(user["_id"])  # Transform _id to id
    return user