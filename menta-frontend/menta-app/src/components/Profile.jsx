import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faBook, faPen, faLaptopCode, faPuzzlePiece } from '@fortawesome/free-solid-svg-icons'; 
import Stats from './Stats';
import axios from 'axios';
import { useAuth } from './AuthContext';
import ProgressTracker from './ProgressTracker';

const Profile = () => {
  const [selectedCategory, setSelectedCategory] = useState('Activities');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const [user, setUser] = useState(null);
  const { getToken } = useAuth();

  const categories = [
    { name: 'Reading', icon: faBook },
    { name: 'Writing', icon: faPen },
    { name: 'Coding', icon: faLaptopCode },
    { name: 'Puzzles', icon: faPuzzlePiece }
  ];

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = getToken();
        const response = await axios.get('http://127.0.0.1:8000/users/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(response.data);
        setFollowers(response.data.followers.length);
        setFollowing(response.data.following.length);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUser();
  }, [getToken]);

  const handleDropdownToggle = () => setIsDropdownOpen(!isDropdownOpen);
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setIsDropdownOpen(false);
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
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span>Cover</span>
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
                <span>User</span>
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
            
          </div>
        </div>
        </div>

        <div className="relative right-5 mx-auto max-w-6xl px-4 grid grid-cols-3 gap-10">
          <div className="bg-white border rounded-lg shadow-lg p-6">

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
                          key={category.name}
                          className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100"
                          onClick={() => handleCategorySelect(category.name)}
                        >
                          {category.icon && (
                            <FontAwesomeIcon icon={category.icon} className="mr-2 w-4 h-4" />
                          )}
                          {category.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            <Stats category={selectedCategory} />
          </div>
        </div>
      </div>
    )
  );
};

export default Profile;
