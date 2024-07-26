import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faPlusCircle, faChevronDown, faUser } from '@fortawesome/free-solid-svg-icons';
import { AuthContext, useAuth } from './AuthContext';

function NavBar() {
  const { isLoggedIn, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [isHomeDropdownOpen, setIsHomeDropdownOpen] = useState(false);
  const [isPlusDropdownOpen, setIsPlusDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMouseInsideHomeDropdown, setIsMouseInsideHomeDropdown] = useState(false);
  const [isMouseInsidePlusDropdown, setIsMouseInsidePlusDropdown] = useState(false);
  const [isMouseInsideProfileDropdown, setIsMouseInsideProfileDropdown] = useState(false);
  const BASE_URL = 'http://127.0.0.1:8000';

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsProfileDropdownOpen(false);
    setIsMouseInsideProfileDropdown(false);
  };

  const buttonStyles = "px-3 py-1 rounded font-normal font-inter transition-colors duration-200 text-sm";

  const handleMouseEnterHomeDropdown = () => {
    setIsHomeDropdownOpen(true);
    setIsMouseInsideHomeDropdown(true);
  };

  const handleMouseLeaveHomeDropdown = () => {
    setIsMouseInsideHomeDropdown(false);
    setIsHomeDropdownOpen(false);
  };

  const handleMouseEnterPlusDropdown = () => {
    setIsPlusDropdownOpen(true);
    setIsMouseInsidePlusDropdown(true);
  };

  const handleMouseLeavePlusDropdown = () => {
    setIsMouseInsidePlusDropdown(false);
    setIsPlusDropdownOpen(false);
  };

  const handleMouseEnterProfileDropdown = () => {
    setIsProfileDropdownOpen(true);
    setIsMouseInsideProfileDropdown(true);
  };

  const handleMouseLeaveProfileDropdown = () => {
    setIsMouseInsideProfileDropdown(false);
    setIsProfileDropdownOpen(false);
  };

  const getActiveClass = (path) => {
    return location.pathname === path ? 'active-link' : '';
  };

  const navigateToProfile = () => {
    navigate(`/profile/${user.id}`);
  };

  return (
    <nav className="bg-white p-4 shadow fixed top-0 left-0 w-full z-10">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <Link to="/" className={`text-blue-500 text-2xl font-bold ${getActiveClass('/')}`}>MENTA</Link>
          {isLoggedIn && (
            <>
              <div 
                className="relative"
                onMouseLeave={() => setIsHomeDropdownOpen(false)}
              >
                <div
                  className="absolute"
                  style={{ top: -10, left: -5, right: -5, bottom: -22, zIndex: 10 }}
                  onMouseEnter={() => setIsHomeDropdownOpen(true)}
                />
                <Link
                  to="/feed"
                  className={`relative flex items-center z-20 ${getActiveClass('/feed')} ${isHomeDropdownOpen || isMouseInsideHomeDropdown ? 'text-blue-500' : 'text-black'} hover:text-blue-500`}
                  onMouseEnter={() => setIsHomeDropdownOpen(true)}
                >
                  Home
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    className={`ml-2 transition-transform duration-300 ${isHomeDropdownOpen ? '-rotate-180' : ''}`}
                  />
                </Link>
                <div
                  className={`rounded-lg absolute -left-4 w-40 bg-white shadow-lg transition-all duration-300 ease-in-out ${isHomeDropdownOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-8 pointer-events-none'}`}
                  style={{ top: '190%' }}
                  onMouseEnter={handleMouseEnterHomeDropdown}
                  onMouseLeave={handleMouseLeaveHomeDropdown}
                >
                  <div className="">
                    <Link to="/userfeed" className="rounded-lg block px-4 py-2 hover:bg-gray-200">My Feed</Link>
                    <Link to="/userclubs" className="rounded-lg block px-4 py-2 hover:bg-gray-200">My Clubs</Link>
                    <Link to="/progress" className="rounded-lg block px-4 py-2 hover:bg-gray-200">My Tracker</Link>
                  </div>
                </div>
              </div>
              <Link to="/maps" className={`text-black hover:text-blue-500 relative z-20 ${getActiveClass('/maps')}`}>Maps</Link>
            </>
          )}
        </div>
        <div className="flex items-center space-x-6">
          {isLoggedIn ? (
            <>
              <div 
                className="relative"
                onMouseLeave={() => setIsPlusDropdownOpen(false)}
              >
                <div
                  className="absolute"
                  style={{ top: -10, left: -5, right: -5, bottom: -22, zIndex: 10 }}
                  onMouseEnter={() => setIsPlusDropdownOpen(true)}
                />
                <button className="hover:text-blue-600 text-2xl relative z-20">
                  <FontAwesomeIcon icon={faPlusCircle} />
                </button>
                <div
                  className={`rounded-lg absolute -right-5 w-40 bg-white shadow-lg transition-all duration-300 ease-in-out ${isPlusDropdownOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-8 pointer-events-none'}`}
                  style={{ top: '155%' }}
                  onMouseEnter={handleMouseEnterPlusDropdown}
                  onMouseLeave={handleMouseLeavePlusDropdown}
                >
                  <div className="">
                    <Link to="/upload-activity" className="rounded-lg block px-4 py-2 hover:bg-gray-100">Upload Activity</Link>
                    <Link to="/upload-status" className="rounded-lg block px-4 py-2 hover:bg-gray-100">Upload Status</Link>
                    <Link to="/manual-entry" className="rounded-lg block px-4 py-2 hover:bg-gray-100">Add Manual Entry</Link>
                  </div>
                </div>
              </div>
              <button className="hover:text-blue-600 text-2xl">
                <FontAwesomeIcon icon={faBell} />
              </button>
              <div 
                className="relative"
                onMouseLeave={() => setIsProfileDropdownOpen(false)}
              >
                <div
                  className="absolute"
                  style={{ top: -10, left: -5, right: -5, bottom: -22, zIndex: 10 }}
                  onMouseEnter={() => setIsProfileDropdownOpen(true)}
                />
      
                <div
                  className={`ml-2 relative flex items-center z-20 ${getActiveClass('/profile')} ${isProfileDropdownOpen || isMouseInsideProfileDropdown ? 'text-blue-500' : 'text-black'} hover:text-blue-500`}
                  onMouseEnter={() => setIsProfileDropdownOpen(true)}
                  onClick={navigateToProfile}
                >
                  {user?.profile_picture ? (
                    <img src={user.profile_picture} alt="Profile" className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <FontAwesomeIcon icon={faUser} className="text-gray-500" />
                    </div>
                  )}
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    className={`ml-2 transition-transform duration-300 ${isProfileDropdownOpen ? '-rotate-180' : ''}`}
                  />
                </div>
                <div
                  className={`rounded-lg absolute right-0 w-40 bg-white shadow-lg transition-all duration-300 ease-in-out ${isProfileDropdownOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-8 pointer-events-none'}`}
                  style={{ top: '155%' }}
                  onMouseEnter={handleMouseEnterProfileDropdown}
                  onMouseLeave={handleMouseLeaveProfileDropdown}
                >
                  <div className="">
                    <button onClick={navigateToProfile} className="rounded-lg block w-full text-left px-4 py-2 hover:bg-gray-100 text-base">My Profile</button>
                    <Link to="/settings" className="rounded-lg block px-4 py-2 hover:bg-gray-100">My Settings</Link>
                    <button onClick={handleLogout} className="rounded-lg block w-full text-left px-4 py-2 hover:bg-gray-100">Logout</button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {location.pathname !== '/signup' && (
                <Link
                  to="/signup"
                  className={`border-2 ${buttonStyles} ${location.pathname === '/login' ? 'bg-blue-500 text-white border-blue-500 hover:bg-blue-600' : 'bg-blue-500 text-white border-blue-500 hover:bg-blue-600'}`}
                >
                  Sign Up
                </Link>
              )}
              {location.pathname !== '/login' && (
                <Link
                  to="/login"
                  className={`border-2 ${buttonStyles} bg-white text-black border-grey hover:bg-gray-100`}
                >
                  Log In
                </Link>
              )}
            </>
          )}
        </div>
      </div>
      <div className="relative">
        {location.pathname === '/feed' && <div className="absolute -bottom-4 left-50 w-24 border-b-2 border-blue-500" />}
        {location.pathname === '/maps' && <div className="absolute -bottom-4 left-76 w-18 border-b-2 border-blue-500" />}
        {location.pathname === '/profile' && <div className="absolute -bottom-4 right-23 w-20 border-b-2 border-blue-500" />}
      </div>
    </nav>
  );
}

export default NavBar;
