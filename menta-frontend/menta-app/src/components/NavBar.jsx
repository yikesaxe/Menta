import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from './AuthContext';

function NavBar() {
  const { isLoggedIn, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const buttonStyles = "px-3 py-1 rounded font-normal font-inter transition-colors duration-200 text-sm";

  return (
    <nav className="bg-white p-4 shadow">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-blue-500 text-2xl font-bold">MENTA</Link>
        <div className="flex space-x-4">
          {!isLoggedIn ? (
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
          ) : (
            <>
              <Link to="/feed" className="text-blue-500 hover:text-blue-600">Home</Link>
              <button onClick={handleLogout} className="text-blue-500 hover:text-blue-600">Logout</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default NavBar;