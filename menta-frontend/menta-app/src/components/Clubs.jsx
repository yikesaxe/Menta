import React, { useState, useRef } from 'react';
import NavBar from './NavBar';

const Clubs = () => {
  const [selectedClub, setSelectedClub] = useState('Select Club');
  const [isClubDropdownOpen, setIsClubDropdownOpen] = useState(false);
  const [clubName, setClubName] = useState('');
  const [location, setLocation] = useState('');

  const clubs = ['Reading', 'Writing', 'Puzzles', 'Coding'];
  const dropdownRef = useRef(null);

  const handleClubSelect = (club) => {
    setSelectedClub(club);
    setIsClubDropdownOpen(false);
  };

  const handleDropdownToggle = () => {
    setIsClubDropdownOpen((prev) => !prev);
  };

  const handleBlur = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.relatedTarget)) {
      setIsClubDropdownOpen(false);
    }
  };

  const handleSubmit = () => {
    // Handle the submit action
    alert('Club details submitted!');
  };

  return (
    <div>
      <NavBar />
      <div className="container mx-auto mt-10">
        <h2 className="text-2xl font-bold mb-6 text-center">Find Clubs Near You</h2>
        <div className="border border-gray-300 rounded-md p-10 shadow-lg">
          <div className="flex flex-col items-center">
            {/* Frame for input boxes, dropdown, and submit button */}
            <div className="flex items-center space-x-4 mb-6">
              {/* Club Name Input */}
              <div className="flex flex-col items-start space-y-2">
                <label className="text-lg font-medium text-gray-700">Club Name</label>
                <input
                  type="text"
                  value={clubName}
                  onChange={(e) => setClubName(e.target.value)}
                  className="px-4 py-2 border rounded-md shadow-sm w-64"
                  placeholder="Enter Club Name"
                />
              </div>

              {/* Location Input */}
              <div className="flex flex-col items-start space-y-2">
                <label className="text-lg font-medium text-gray-700">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="px-4 py-2 border rounded-md shadow-sm w-64"
                  placeholder="Enter Location"
                />
              </div>

              {/* Club Dropdown */}
              <div
                className="relative flex flex-col items-start space-y-2"
                ref={dropdownRef}
                onBlur={handleBlur}
                tabIndex={0}
              >
                <label className="text-lg font-medium text-gray-700">Club Type</label>
                <button
                  className="flex justify-between items-center px-4 py-2 border rounded-md shadow-sm bg-white text-gray-700 w-64"
                  onClick={handleDropdownToggle}
                >
                  {selectedClub}
                  <svg className="ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M5.292 7.707a1 1 0 011.416-1.414L10 9.585l3.292-3.292a1 1 0 011.416 1.414l-4 4a1 1 0 01-1.416 0l-4-4z" clipRule="evenodd" />
                  </svg>
                </button>
                {isClubDropdownOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                    <div className="py-1">
                      {clubs.map((club) => (
                        <button
                          key={club}
                          onClick={() => handleClubSelect(club)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
                        >
                          {club}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Clubs;