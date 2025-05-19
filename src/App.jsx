import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Homepage from './pages/homepage';
import Login from './pages/login';
import Register from './pages/register';
import Notes from './pages/notes';
import Pomodoro from './pages/pomodoro';
import UserProfile from './pages/userProfile';
import ErrorPage from './pages/errorPage';
import FlashCardSet from './pages/flashCardSet';
import FlashCardDetail from './pages/flashCardDetail';
import StudyFlashCard from './pages/studyFlashCard';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <div className="h-screen">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/pomodoro" element={<Pomodoro />} />
          <Route path="/userprofile" element={<UserProfile />} />
          <Route path="/flashcardset" element={<FlashCardSet />} />
          <Route path="/flashcardset/:setId" element={<FlashCardDetail />} />
          <Route path="/studyflashcard/:setId" element={<StudyFlashCard />} />
          
          {/* Protected routes */}
          
          <Route 
            path="/landingPage" 
            element={
              <ProtectedRoute>
                <LandingPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/notes" 
            element={
              <ProtectedRoute>
                <Notes />
              </ProtectedRoute>
            } 
          />
          <Route path="/error" element={<ErrorPage />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;