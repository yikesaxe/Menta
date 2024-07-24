import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faBook, faPen, faLaptopCode, faPuzzlePiece } from '@fortawesome/free-solid-svg-icons'; 
import Stats from './Stats'; 

const Profile = () => {
  const [selectedCategory, setSelectedCategory] = useState('Activities');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [followers, setFollowers] = useState(1); 
  const [following, setFollowing] = useState(1); 

  const categories = [
    { name: 'Reading', icon: faBook },
    { name: 'Writing', icon: faPen },
    { name: 'Coding', icon: faLaptopCode },
    { name: 'Puzzles', icon: faPuzzlePiece }
  ];

  const handleDropdownToggle = () => setIsDropdownOpen(!isDropdownOpen);
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative min-h-screen mt-16">
      <div className="flex p-10">
        <div className="flex flex-col items-start w-1/3">
          <div className="flex items-center mb-4">
            <img 
              src="https://via.placeholder.com/150" 
              alt="User Profile" 
              className="w-32 h-32 rounded-full"
            />
          </div>
          <div className="text-left mb-4">
            <h1 className="text-2xl font-bold">Username</h1>
            <div className="flex mt-2">
              <div className="mr-6">
                <p className="font-medium">Followers</p>
                <p className="text-lg">{followers}</p>
              </div>
              <div>
                <p className="font-medium">Following</p>
                <p className="text-lg">{following}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-1/4 flex justify-center">
        <div className="w-screen max-w-screen-lg mx-4 bg-white border rounded-lg shadow-lg">
          <div className="flex flex-col items-center p-4">
            <label htmlFor="category" className="text-lg font-medium mb-2">
              Progress Tracker:
            </label>
            
            <div 
              className="relative"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
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
  );
};

export default Profile;