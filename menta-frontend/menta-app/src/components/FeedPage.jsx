import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ActivityCard from './ActivityCard'; 

function FeedPage() {
  const { isLoggedIn, user, getToken } = useAuth();
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login'); // Redirect to login if the user is not authenticated
    } else {
      fetchActivities();
    }
  }, [isLoggedIn, navigate]);

  const fetchActivities = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/activities', {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      setActivities(response.data);
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  const filterActivities = (activity) => {
    if (activity.privacy_type === 'everyone') return true;
    if (activity.privacy_type === 'followers' && user.following.includes(activity.user_id)) return true;
    if (activity.privacy_type === 'only_you' && activity.user_id === user.id) return true;
    return false;
  };

  if (!user) {
    return null; // or a loading indicator
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-16 flex m-1">
      {/* Left Sidebar */}
      <div className="w-1/4 pr-2 pl-2 ml-1 mr-1">
        {/* Content for the left sidebar */}
      </div>

      {/* Main Content */}
      <div className="flex-grow pr-2 pl-2 overflow-y-auto ml-1 mr-1">
        {activities.filter(filterActivities).map((activity) => (
          <ActivityCard key={activity.id} activity={activity} />
        ))}
      </div>

      {/* Right Sidebar */}
      <div className="w-1/4 pr-2 pl-2 ml-1 mr-1">
        {/* Content for the right sidebar */}
      </div>
    </div>
  );
}

export default FeedPage;
