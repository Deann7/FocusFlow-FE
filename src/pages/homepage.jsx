import React from 'react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Homepage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Cloud positions for animation
    const cloudPositions = [
      { top: '15%', delay: 0, direction: 'right-to-left' },
      { top: '35%', delay: 2, direction: 'left-to-right' },
      { top: '60%', delay: 1, direction: 'right-to-left' },
      { top: '80%', delay: 3, direction: 'left-to-right' }
    ];

    useEffect(() => {
      const authStatus = localStorage.getItem('isAuthenticated') === 'true';
      setIsAuthenticated(authStatus);
      
      if (authStatus) {
        try {
          const userData = JSON.parse(localStorage.getItem('user'));
          setUser(userData);
        } catch (e) {
          console.error('Error parsing user data:', e);
        }
      }
    }, []);

    const handleLogout = () => {
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
      setUser(null);
      setIsAuthenticated(false);
    };
    
    // Function to handle navigation based on authentication status with SweetAlert
    const handleNavigate = (path, featureName) => {
      if (isAuthenticated) {
        navigate(`/${path}`);
      } else {
        // Show SweetAlert2 notification
        Swal.fire({
          title: 'Login Required',
          text: `Please login to access ${featureName} feature`,
          icon: 'info',
          confirmButtonText: 'Login Now',
          showCancelButton: true,
          cancelButtonText: 'Later',
          background: '#ffffff',
          confirmButtonColor: '#3b82f6',
          cancelButtonColor: '#cbd5e1',
          iconColor: '#3b82f6',
          customClass: {
            title: 'font-poppins text-blue-600',
            content: 'font-poppins'
          }
        }).then((result) => {
          if (result.isConfirmed) {
            navigate('/login');
          }
        });
      }
    };
    
    // Component for Cloud SVG
    const Cloud = () => (
      <img src="/cloud.svg" alt="Cloud" className="w-24 h-16" />
    );
    
    // Component for Book SVG
    const Book = () => (
      <img src="/book.svg" alt="Book" className="w-full h-full" />
    );
    
    // SVG icons for feature cards
    const CreateNoteIcon = () => (
      <img src="/createNote.svg" alt="Create Note" className="w-6 h-6" />
    );
    
    const PomodoroIcon = () => (
      <img src="/pomodoro.svg" alt="Pomodoro Timer" className="w-6 h-6" />
    );
    
    const FlashcardIcon = () => (
      <img src="/flashcard.svg" alt="Flashcards" className="w-6 h-6" />
    );

    return (
      <div className="w-full h-full bg-blue-300 flex flex-col items-center overflow-hidden relative">
        {/* Animated Clouds - with different directions */}
        {cloudPositions.map((cloud, index) => (
          <motion.div
            key={index}
            className="absolute z-10"
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
        
        {/* Logo and Heading */}
        <motion.div 
          className="mt-16 flex items-center justify-center z-20"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <motion.div 
            className="w-16 h-16 border-none bg-blue-300 flex items-center justify-center mr-2"
            animate={{ rotate: [0, 0, 5, -5, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          >
            <Book />
          </motion.div>
          <motion.h1 
            className="text-4xl text-white font-bold font-poppins" 
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          >
            FocusFlow*
          </motion.h1>
        </motion.div>
        
        {/* Subtitle */}
        <motion.p
          className="text-white text-center mt-2 mb-10 max-w-md px-4 font-poppins"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          Complete productivity app for students to manage notes, time, and flashcards effectively
        </motion.p>

        {/* Feature Cards */}
        <div className="w-full max-w-md px-4 z-20">
          {/* Create Notes Card - Now a button with SweetAlert */}
          <motion.button
            onClick={() => handleNavigate('notes', 'Notes')}
            className="w-full text-left bg-white rounded-lg shadow-md p-5 mb-4 cursor-pointer border border-transparent hover:border-blue-200"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ 
              scale: 1.02, 
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
              backgroundColor: "#f0f9ff" 
            }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <CreateNoteIcon />
              </div>
              <h3 className="ml-3 text-lg font-bold text-blue-500 font-poppins">Create Notes</h3>
            </div>
            <p className="mt-2 text-sm text-gray-500 font-poppins">
              Create and organize your notes with deadlines and completion tracking.
            </p>
          </motion.button>

          {/* Pomodoro Timer Card - Now a button with SweetAlert */}
          <motion.button
            onClick={() => handleNavigate('pomodoro', 'Pomodoro Timer')}
            className="w-full text-left bg-white rounded-lg shadow-md p-5 mb-4 cursor-pointer border border-transparent hover:border-blue-200"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            whileHover={{ 
              scale: 1.02, 
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
              backgroundColor: "#f0f9ff" 
            }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <PomodoroIcon />
              </div>
              <h3 className="ml-3 text-lg font-bold text-blue-500 font-poppins">Pomodoro Timer</h3>
            </div>
            <p className="mt-2 text-sm text-gray-500 font-poppins">
              Stay focused with customizable pomodoro timers and break sessions.
            </p>
          </motion.button>

          {/* Flashcards Card - Now a button with SweetAlert */}
          <motion.button
            onClick={() => handleNavigate('flashcard', 'Flashcards')}
            className="w-full text-left bg-white rounded-lg shadow-md p-5 mb-4 cursor-pointer border border-transparent hover:border-blue-200"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            whileHover={{ 
              scale: 1.02, 
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
              backgroundColor: "#f0f9ff" 
            }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <FlashcardIcon />
              </div>
              <h3 className="ml-3 text-lg font-bold text-blue-500 font-poppins">Flashcards</h3>
            </div>
            <p className="mt-2 text-sm text-gray-500 font-poppins">
              Create and study flashcards to improve your learning experience.
            </p>
          </motion.button>
        </div>

        {/* Login/Register Buttons */}
        {!isAuthenticated && (
          <div className="z-20 mt-4 w-full max-w-md px-4">
            <motion.button
              className="w-full bg-Yellow_Pixel text-blue-600 font-bold py-3 rounded-md mb-3 font-poppins"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              whileHover={{ scale: 1.02, backgroundColor: "#fffbeb" }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/login')}
            >
              Login
            </motion.button>

            <motion.button
              className="w-full bg-transparent border-2 border-white text-white font-bold py-3 rounded-md font-poppins"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/register')}
            >
              Register
            </motion.button>
          </div>
        )}

        {/* Footer */}
        <motion.div
          className="z-20 mt-8 font-bold mb-10 max-md:mb-6 text-center text-Yellow_Pixel text-sm font-poppins"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          © 2025 FocusFlow. All rights reserved.
        </motion.div>
      </div>
    );
}

export default Homepage;