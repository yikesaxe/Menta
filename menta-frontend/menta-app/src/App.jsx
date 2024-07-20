import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import AccountCreation from './components/AccountCreation';
import LoginPage from './components/LoginPage';
import FeedPage from './components/FeedPage';
import NavBar from './components/NavBar';
import { AuthProvider } from './components/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<AccountCreation />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/feed" element={<FeedPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;