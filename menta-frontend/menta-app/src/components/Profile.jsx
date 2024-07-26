import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faUser } from '@fortawesome/free-solid-svg-icons'; 
import Stats from './Stats';
import axios from 'axios';
import { useAuth } from './AuthContext';
import ProgressTracker from './ProgressTracker';

const Profile = () => {
  const { userId } = useParams(); // Get the user ID from the URL
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState([]);
  const [latestActivities, setLatestActivities] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false); // Track follow status
  const [hoveringFollowButton, setHoveringFollowButton] = useState(false); // Track hover state
  const { getToken, user: authUser } = useAuth();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = getToken();
        const response = await axios.get(`http://127.0.0.1:8000/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(response.data);
        setFollowers(response.data.followers.length);
        setFollowing(response.data.following.length);
        setCategories(response.data.interests); // Assuming interests are an array of strings
        if (response.data.interests.length > 0) {
          setSelectedCategory(response.data.interests[0]);
        }

        // Check if the current user is following this user
        setIsFollowing(response.data.followers.includes(authUser.id));

      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const fetchLatestActivities = async () => {
      try {
        const token = getToken();
        const response = await axios.get(`http://127.0.0.1:8000/activities/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setLatestActivities(response.data);
      } catch (error) {
        console.error('Error fetching latest activities:', error);
      }
    };

    fetchUser();
    fetchLatestActivities();
  }, [getToken, userId, authUser.id]);

  const handleDropdownToggle = () => setIsDropdownOpen(!isDropdownOpen);
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setIsDropdownOpen(false);
  };

  const handleFollow = async () => {
    try {
      const token = getToken();
      await axios.post('http://127.0.0.1:8000/follow', { target_user_id: userId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsFollowing(true);
      setFollowers(prev => prev + 1);
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  const handleUnfollow = async () => {
    try {
      const token = getToken();
      await axios.post('http://127.0.0.1:8000/unfollow', { target_user_id: userId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsFollowing(false);
      setFollowers(prev => prev - 1);
    } catch (error) {
      console.error('Error unfollowing user:', error);
    }
  };

  const handleMouseEnter = () => {
    setHoveringFollowButton(true);
  };

  const handleMouseLeave = () => {
    setHoveringFollowButton(false);
  };

  return (
    user && (
      <div className="relative min-h-screen mt-16">
        <div className='mb-60'>
          <div className="relative h-64">
            {user.cover_photo ? (
              <img 
                src={user.cover_photo}
                alt="Cover" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-starry-gradient flex items-center justify-center">
              </div>
            )}
            <div className="relative -top-18 left-48">
              {user.profile_picture ? (
                <img 
                  src={user.profile_picture}
                  alt="User Profile" 
                  className="w-32 h-32 rounded-full border-4 border-white object-cover"
                />
              ) : (
                <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center">
                  <FontAwesomeIcon icon={faUser} className="text-gray-500" size="3x" />
                </div>
              )}
              <h1 className="text-2xl font-bold mt-4">{user.first_name} {user.last_name}</h1>
              <div className="flex mt-2">
                <div className="mr-6">
                  <p className="font-medium">Followers</p>
                  <p className="text-lg">{followers}</p>
                </div>
                <div>
                  <p className="font-medium">Following</p>
                  <p className="text-lg">{following}</p>
                </div>
                <div className='w-full ml-64'>
                  <ProgressTracker userId={user.id}/>
                </div>
              </div>
              {authUser.id !== userId && (
                <button
                  className={`relative -top-16 px-8 py-1 rounded shadow-md border ${isFollowing ? 'bg-gray-200 text-gray-700' : 'bg-blue-600 text-white'} hover:bg-blue-600 ${hoveringFollowButton && isFollowing ? 'hover:text-white' : ''}`}
                  onClick={isFollowing ? handleUnfollow : handleFollow}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  {isFollowing ? (hoveringFollowButton ? 'Unfollow' : 'Following') : 'Follow'}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="relative right-5 mx-auto max-w-6xl px-4 grid grid-cols-3 gap-10">
          <div className="bg-white border rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-2">Bio</h2>
            <p className="text-gray-700">{user.bio}</p>
            <h2 className="text-xl font-semibold mt-6 mb-2">Latest Activities</h2>
            {latestActivities.length > 0 ? (
              <ul className="list-disc pl-5">
                {latestActivities.map(activity => (
                  <li key={activity.id} className="text-gray-700">
                    {activity.title} - {new Date(activity.date).toLocaleDateString()}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-700">No recent activities.</p>
            )}
          </div>
          <div className="col-span-2 bg-white border rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <label htmlFor="category" className="text-lg font-medium">
                Overview:
              </label>
              <div className="relative">
                <button
                  type="button"
                  className="flex items-center p-2 border rounded"
                  onClick={handleDropdownToggle}
                >
                  {selectedCategory}
                  <FontAwesomeIcon icon={faChevronDown} className="ml-2 w-5 h-5" />
                </button>

                {isDropdownOpen && (
                  <div className="absolute left-0 top-full mt-2 w-48 bg-white border rounded shadow-lg">
                    <ul className="py-1">
                      {categories.map((category) => (
                        <li
                          key={category}
                          className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100"
                          onClick={() => handleCategorySelect(category)}
                        >
                          {category}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            <Stats category={selectedCategory} userId={user.id} />
          </div>
        </div>
      </div>
    )
  );
};

export default Profile;
