import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ActivityCard from './ActivityCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

function FeedPage() {
  const { isLoggedIn, user, getToken } = useAuth();
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [filter, setFilter] = useState('Everyone');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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

  const handleFilterChange = (value) => {
    setFilter(value);
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const filterActivities = (activity) => {
    if (filter === 'Everyone') {
      return activity.privacy_type === 'Everyone';
    }
    if (filter === 'Followers') {
      return activity.privacy_type === 'Followers' && user.following.includes(activity.user_id);
    }
    return false;
  };

  if (!user) {
    return null; // or a loading indicator
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-16 px-4 grid grid-cols-12 gap-4 mt-2">
      {/* Left Sidebar */}
      <div className="col-span-3 bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 bg-green-500 rounded-full mb-4"></div>
          <h2 className="text-xl font-semibold">{user.name}</h2>
          <p className="text-gray-500">Following: 0 | Followers: 0 | Activities: 0</p>
        </div>
        <button className="mt-4 w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600">
          Add an Activity
        </button>
      </div>

      {/* Main Content */}
      <div className="col-span-6 p-4 bg-white rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4 relative">
          <div
            className="flex items-center justify-between w-1/4 bg-gray-200 rounded-md border-0 py-2 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-green-500 sm:text-sm sm:leading-6 cursor-pointer"
            onClick={toggleDropdown}
          >
            {filter}
            <FontAwesomeIcon icon={faChevronDown} className={`ml-2 transition-transform duration-300 ${isDropdownOpen ? '-rotate-180' : ''}`} />
          </div>
          {isDropdownOpen && (
            <div
              className="rounded-lg absolute z-10 w-1/4 bg-white shadow-lg overflow-auto max-h-48"
              style={{ top: '100%' }}
            >
              <div>
                <div
                  className="block px-4 py-2 text-sm hover:bg-gray-200 cursor-pointer"
                  onClick={() => handleFilterChange('Everyone')}
                >
                  Everyone
                </div>
                <div
                  className="block px-4 py-2 text-sm hover:bg-gray-200 cursor-pointer"
                  onClick={() => handleFilterChange('Followers')}
                >
                  Followers
                </div>
              </div>
            </div>
          )}
        </div>
        {activities.filter(filterActivities).map((activity) => (
          <ActivityCard key={activity.id} activity={activity} getToken={getToken} />
        ))}
      </div>

      {/* Right Sidebar */}
      <div className="col-span-3 bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col items-center">
          <h3 className="text-lg font-semibold mb-2">Clubs on Menta</h3>
          <p className="text-gray-500 text-center">Join clubs to enhance your academic experience.</p>
          <button className="mt-4 w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600">
            Find Clubs
          </button>
        </div>
        <div className="flex flex-col items-center mt-6">
          <h3 className="text-lg font-semibold mb-2">Your Friends on Menta</h3>
          <p className="text-gray-500 text-center">Invite friends to join and share your academic journey.</p>
          <button className="mt-4 w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600">
            Find Friends
          </button>
        </div>
      </div>
    </div>
  );
}

export default FeedPage;
