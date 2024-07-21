import React, { useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

function FeedPage() {
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login'); // Redirect to login if the user is not authenticated
    }
  }, [isLoggedIn, navigate]);

  if (!user) {
    return null; // or a loading indicator
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Feed</h2>
        <p className="text-center">Welcome to your feed, {user.first_name}!</p>
        {/* Add feed content here */}
      </div>
    </div>
  );
}

export default FeedPage;