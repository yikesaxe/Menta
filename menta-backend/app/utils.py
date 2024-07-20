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