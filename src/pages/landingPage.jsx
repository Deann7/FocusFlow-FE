import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar';

const LandingPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Cloud positions for animation
  const cloudPositions = [
    { top: '15%', delay: 0, direction: 'right-to-left' },
    { top: '35%', delay: 2, direction: 'left-to-right' },
    { top: '60%', delay: 1, direction: 'right-to-left' },
    { top: '80%', delay: 3, direction: 'left-to-right' }
  ];

  useEffect(() => {
    // Get user from localStorage
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);
  }, []);

  // Component for Cloud SVG
  const Cloud = () => (
    <img src="/cloud.svg" alt="Cloud" className="w-24 h-16" />
  );

  return (
    <div className="w-full h-screen bg-blue-300 flex flex-col items-center overflow-y-auto">
      <Navbar />

      {/* Main content */}
      <div className="w-full max-w-6xl px-4 py-6 flex flex-col items-center">
        {/* Animated Clouds - with different directions */}
        {cloudPositions.map((cloud, index) => (
          <motion.div
            key={index}
            className="fixed z-10"
            initial={cloud.direction === 'right-to-left' ? { right: -150 } : { left: -150 }}
            animate={cloud.direction === 'right-to-left' ? { right: '100%' } : { left: '100%' }}
            transition={{
              repeat: Infinity,
              duration: 20 + index * 4,
              delay: cloud.delay,
              ease: "linear"
            }}
            style={{ top: cloud.top }}
          >
            <Cloud />
          </motion.div>
        ))}
        
        {/* Welcome Message */}
        <motion.div
          className="z-20 w-full text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-3xl font-bold text-Yellow_Pixel font-poppins mb-2">
            Welcome Back, {user?.name || 'Friend'}!
          </h1>
          <p className="text-Yellow_Pixel font-poppins text-lg">
            Your personal productivity hub. What would you like to focus on today?
          </p>
        </motion.div>
        
        {/* Feature Cards in a 2x2 grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-5xl z-20 text-Yellow_Pixel">
          {/* Notes Card */}
          <motion.div
            className="bg-white/20 backdrop-blur-md rounded-lg p-6 border border-white/30 shadow-lg cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ 
              scale: 1.03,
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)"
            }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/notes')}
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                <img src="/notes.svg" alt="Notes" className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white font-poppins mb-2">Notes</h3>
              <p className="text-white/70 text-sm font-poppins">
                Create and manage your study notes
              </p>
            </div>
          </motion.div>
          
          {/* Pomodoro Card */}
          <motion.div
            className="bg-white/20 backdrop-blur-md rounded-lg p-6 border border-white/30 shadow-lg cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ 
              scale: 1.03,
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)"
            }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/pomodoro')}
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                <img src="/pomodoro.svg" alt="Pomodoro" className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white font-poppins mb-2">Pomodoro Timer</h3>
              <p className="text-white/70 text-sm font-poppins">
                Stay focused and manage your time
              </p>
            </div>
          </motion.div>

          {/* Flashcards Card */}
          <motion.div
            className="bg-white/20 backdrop-blur-md rounded-lg p-6 border border-white/30 shadow-lg cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ 
              scale: 1.03,
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)"
            }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/flashcardset')}
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                <img src="/flashcard.svg" alt="Flashcards" className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white font-poppins mb-2">Flashcards</h3>
              <p className="text-white/70 text-sm font-poppins">
                Create and study with flashcards
              </p>
            </div>
          </motion.div>
          
          {/* User Profile Card */}
          <motion.div
            className="bg-white/20 backdrop-blur-md rounded-lg p-6 border border-white/30 shadow-lg cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ 
              scale: 1.03,
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)"
            }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/userProfile')}
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                <img src="/profile.svg" alt="Profile" className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white font-poppins mb-2">User Profile</h3>
              <p className="text-white/70 text-sm font-poppins">
                View and manage your profile
              </p>
            </div>
          </motion.div>
        </div>
        
        {/* Promotional Banner */}
        <motion.div
          className="mt-8 w-full bg-gradient-to-r from-purple-500/30 to-blue-500/30 backdrop-blur-md rounded-lg p-6 border border-white/30 shadow-lg z-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold text-white font-poppins mb-2">Boost Your Productivity</h3>
              <p className="text-white/70 text-sm font-poppins">
                FocusFlow helps you manage your time, organize your notes, and learn efficiently.
              </p>
            </div>            <motion.button
              className="bg-white/20 backdrop-blur-md text-white px-6 py-2 rounded-md border border-white/30 font-poppins"
              whileHover={{ scale: 1.03, backgroundColor: 'rgba(255, 255, 255, 0.3)' }}
              whileTap={{ scale: 0.97 }}
              onClick={() => window.open('https://www.forbes.com/councils/forbescoachescouncil/2023/12/13/practical-steps-to-boost-your-productivity/', '_blank')}
            >
              Learn More
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.div
        className="z-20 mt-auto py-4 text-center text-white/70 text-sm font-poppins"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        © 2025 FocusFlow. All rights reserved.
      </motion.div>
    </div>
  );
};

export default LandingPage;