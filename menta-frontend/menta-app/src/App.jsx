import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import AccountCreation from './components/AccountCreation';
import LoginPage from './components/LoginPage';
import FeedPage from './components/FeedPage';
import NavBar from './components/NavBar';
import { AuthProvider } from './components/AuthContext';
import UploadActivity from './components/UploadActivity';
import Profile from './components/Profile';
import SettingsPage from './components/Settings';
import Map from './components/Map';
import UserFeed from './components/UserFeed';
import Footer from './components/Footer'; 

function App() {
  return (
    <AuthProvider>
      <Router>
        <NavBar />
        <div className="flex flex-col min-h-screen">
          <div className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/signup" element={<AccountCreation />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/feed" element={<FeedPage />} />
              <Route path="/upload-activity" element={<UploadActivity />} />
              <Route path="/profile/:userId" element={<Profile />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/maps" element={<Map />} />
              <Route path="/userfeed" element={<UserFeed />} />
            </Routes>
          </div>
          <Footer /> 
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
