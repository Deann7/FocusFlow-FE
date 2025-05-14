import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Homepage from "./pages/homepage";
import Login from "./pages/login";
import Register from "./pages/register";
import LandingPage from "./pages/landingPage";
import Notes from "./pages/notes";
import Pomodoro from "./pages/pomodoro";
import Flashcard from "./pages/flashcard";

// Protected route component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <div className="h-screen">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
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
          <Route 
            path="/pomodoro" 
            element={
              <ProtectedRoute>
                <Pomodoro />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/flashcard" 
            element={
              <ProtectedRoute>
                <Flashcard />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
