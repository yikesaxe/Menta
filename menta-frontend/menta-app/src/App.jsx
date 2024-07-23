import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import AccountCreation from './components/AccountCreation';
import LoginPage from './components/LoginPage';
import FeedPage from './components/FeedPage';
import Profile from './components/Profile';
import Settings from './components/Settings';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<AccountCreation />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  );
}

export default App;