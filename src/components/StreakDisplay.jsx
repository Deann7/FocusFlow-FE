import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const StreakDisplay = ({ userId }) => {
  const [streak, setStreak] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const apiUrl = 'http://focus-flow-be.vercel.app';
  
  // Fetch streak data
  useEffect(() => {
    if (!userId) return;
    
    const fetchStreak = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await axios.get(`${apiUrl}/api/streak/user/${userId}`);
        
        if (response.data.success) {
          setStreak(response.data.payload);
        } else {
          setError(response.data.message || 'Failed to load streak data');
        }
      } catch (error) {
        console.error('Error fetching streak:', error);
        setError('Failed to load streak information');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStreak();
  }, [userId]);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-2">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          className="w-4 h-4 rounded-full border-2 border-blue-300 border-t-transparent"
        />
      </div>
    );
  }
  
  if (error) {
    return null; // Hide on error
  }
  
  if (!streak) {
    return null;
  }
  
  return (
    <motion.div 
      className="bg-yellow-400/20 backdrop-filter backdrop-blur-sm rounded-lg py-2 px-4 text-white text-center flex items-center"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <svg 
        className="w-5 h-5 mr-2 text-yellow-400" 
        fill="currentColor" 
        viewBox="0 0 20 20"
      >
        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
      </svg>
      <div className="font-poppins">
        <span className="font-bold">{streak.current_streak} day streak</span>
        {streak.longest_streak > streak.current_streak && (
          <span className="text-xs ml-2">(Best: {streak.longest_streak})</span>
        )}
      </div>
    </motion.div>
  );
};

export default StreakDisplay;