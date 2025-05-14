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
      <div className="w-full max-w-4xl px-4 py-6 flex flex-col items-center">
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
          <h1 className="text-2xl font-bold text-white font-poppins mb-2">
            Welcome Back, {user?.name || 'Friend'}!
          </h1>
          <p className="text-white/80 font-poppins">
            Your personal productivity hub. What would you like to focus on today?
          </p>
        </motion.div>
        
        {/* Feature Cards with blur effect similar to the image */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl z-20">
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

          {/* Pomodoro Timer Card */}
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

          {/* Expense Tracker Card */}
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
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white font-poppins mb-2">Expense Tracker</h3>
              <p className="text-white/70 text-sm font-poppins">
                Track and visualize your spending
              </p>
            </div>
          </motion.div>

          {/* Flashcards Card */}
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
            onClick={() => navigate('/flashcard')}
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
        </div>
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