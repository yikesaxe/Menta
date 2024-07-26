import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import ActivityCard from './ActivityCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faUser } from '@fortawesome/free-solid-svg-icons';

function FeedPage() {
  const { isLoggedIn, user, getToken } = useAuth();
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [filter, setFilter] = useState('Everyone');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [latestActivities, setLatestActivities] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login'); // Redirect to login if the user is not authenticated
    } else {
      fetchActivities();
      fetchLatestActivities();
      fetchAllUsers();
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

  const fetchLatestActivities = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/activities/user/${user.id}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setLatestActivities(response.data);
    } catch (error) {
      console.error('Error fetching latest activities:', error);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/users', {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setAllUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
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
      return (
        activity.privacy_type === 'Everyone' ||
        (activity.privacy_type === 'Followers' && user.following.includes(activity.user_id))
      );
    }
    if (filter === 'Following') {
      return user.following.includes(activity.user_id);
    }
    return false;
  };

  if (!user) {
    return null; // or a loading indicator
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-16 px-4 grid grid-cols-12 gap-4 mt-2">
      {/* Left Sidebar */}
      <div className="h-1/2 col-span-3 ml-16 px-8 mt-15 bg-white rounded-lg shadow-md">
        <div className="flex flex-col items-center">
          {user.profile_picture ? (
            <img 
              src={user.profile_picture}
              alt="User Profile" 
              className="relative -top-10 w-24 h-24 rounded-full border-4 border-white object-cover -mb-8"
            />
          ) : (
            <div className="w-24 h-24 relative -top-10 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center -mb-8">
              <FontAwesomeIcon icon={faUser} className="text-gray-500" size="2x" />
            </div>
          )}
          <h2 className="text-xl font-semibold">{user.first_name} {user.last_name}</h2>
          <p className="text-gray-500">Following: {user.following.length} | Followers: {user.followers.length} </p> 
          <p className="text-gray-500"> Total Activities: {activities.length}</p>
        </div>
        <button 
          className="mt-4 w-full bg-starry-gradient text-white py-2 px-4 rounded-md hover:bg-starry-gradient-hover"
          onClick={() => navigate('/upload-activity')}
        >
          Add an Activity
        </button>
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Latest Activities</h2>
          {latestActivities.length > 0 ? (
            <ul className="list-disc pl-5 text-gray-700">
              {latestActivities.map(activity => (
                <li key={activity.id}>
                  {activity.title} - {new Date(activity.date).toLocaleDateString()}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-700">No recent activities.</p>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="col-span-6 p-4 overflow-y-auto mx-8">
        <div className="flex justify-between items-center mb-2 relative">
          <div
            className="flex items-center justify-between w-1/4 bg-white rounded-md border-0 py-1.5 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6 cursor-pointer"
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
                  className="rounded-lg block px-4 py-2 text-sm hover:bg-gray-200 cursor-pointer"
                  onClick={() => handleFilterChange('Everyone')}
                >
                  Everyone
                </div>
                <div
                  className="rounded-lg block px-4 py-2 text-sm hover:bg-gray-200 cursor-pointer"
                  onClick={() => handleFilterChange('Followers')}
                >
                  Followers
                </div>
                <div
                  className="rounded-lg block px-4 py-2 text-sm hover:bg-gray-200 cursor-pointer"
                  onClick={() => handleFilterChange('Following')}
                >
                  Following
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
      <div className="col-span-3 p-4 mr-16 mt-15 h-1/2">
        <div className="flex flex-col items-center">
          <h3 className="text-lg font-semibold mb-2">Clubs on Menta</h3>
          <p className="text-gray-500 text-center">Join clubs to enhance your academic experience.</p>
          <button className="mt-4 w-full bg-starry-gradient text-white py-2 px-4 rounded-md hover:bg-starry-gradient-hover">
            Find Clubs
          </button>
        </div>
        <div className="flex flex-col items-center mt-6">
          <h3 className="text-lg font-semibold mb-2">Your Friends on Menta</h3>
          <p className="text-gray-500 text-center">Invite friends to join and share your academic journey.</p>
          <button className="mt-4 w-full bg-starry-gradient text-white py-2 px-4 rounded-md hover:bg-starry-gradient-hover">
            Find Friends
          </button>
        </div>
        <div className="flex flex-col items-center mt-6">
          <h3 className="text-lg font-semibold mb-2">Suggested Users</h3>
          <div className="w-full max-h-64 overflow-y-auto">
            {allUsers.map((user) => (
              <Link to={`/profile/${user.id}`} key={user.id} className="flex items-center p-2 hover:bg-gray-100 rounded-md mb-2">
                {user.profile_picture ? (
                  <img 
                    src={user.profile_picture}
                    alt="User Profile" 
                    className="w-10 h-10 rounded-full object-cover mr-4"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                    <FontAwesomeIcon icon={faUser} className="text-gray-500" />
                  </div>
                )}
                <span className="text-gray-700">{user.first_name} {user.last_name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FeedPage;
