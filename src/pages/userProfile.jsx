import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [userData, setUserData] = useState(null);
  
  // Get user data from localStorage
  useEffect(() => {
    const getUserData = () => {
      try {
        const user = localStorage.getItem('user');
        if (user) {
          setUserData(JSON.parse(user));
        } else {
          // Redirect to login if no user data
          navigate('/login');
        }
      } catch (error) {
        console.error('Error retrieving user data:', error);
        navigate('/login');
      }
    };
    
    getUserData();
  }, [navigate]);

    // Handle tab change
    useEffect(() => {() => {console.log('Tab changed to:', activeTab);}}, [activeTab]);
  

  // Cloud animation components
  const Cloud = () => (
    <img src="/cloud.svg" alt="Cloud" className="opacity-80" />
  );

  const Profile = () => (
    <img src="/profile.svg" alt="Profile" className="opacity-95 w-fit h-fit" />
    );

  const cloudPositions = [
    { top: '10%', delay: 0, direction: 'right-to-left', opacity: 0.9 },
    { top: '30%', delay: 2, direction: 'left-to-right', opacity: 0.9 },
    { top: '50%', delay: 1, direction: 'right-to-left', opacity: 0.9 },
    { top: '70%', delay: 3, direction: 'left-to-right', opacity: 0.9 },
    { top: '90%', delay: 2, direction: 'right-to-left', opacity: 0.9 },
  ];

  const faqData = [
    {
      question: "What is FocusFlow?",
      answer: "FocusFlow is a productivity app designed to help students manage their tasks, time, and learning materials efficiently."
    },
    {
      question: "How does the Pomodoro timer work?",
      answer: "The Pomodoro technique is a time management method that uses a timer to break work into intervals, traditionally 25 minutes in length, separated by short breaks. FocusFlow's timer helps you implement this technique easily."
    },
    {
      question: "How do I create notes?",
      answer: "Go to the Notes section, click on 'Create', fill in the required details like title, description, and deadline, then click 'Create Task'."
    },
    {
      question: "Can I change my password?",
      answer: "Currently, password change functionality is under development. Please contact support if you need to reset your password."
    },
    {
      question: "Is my data secure?",
      answer: "Yes, we take data security seriously. Your data is encrypted and stored securely on our servers."
    }
  ];

  if (!userData) {
    return (
      <div className="w-full min-h-screen bg-blue-300 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-blue-300 flex flex-col items-center justify-start pt-5 md:pt-10 overflow-y-auto relative">
      {/* Animated clouds as background */}
      {cloudPositions.map((cloud, index) => (
        <motion.div
          key={index}
          className="absolute z-0"
          initial={cloud.direction === 'right-to-left' ? { right: -150 } : { left: -150 }}
          animate={cloud.direction === 'right-to-left' ? { right: '100%' } : { left: '100%' }}
          transition={{
            repeat: Infinity,
            duration: 20 + index * 4,
            delay: cloud.delay,
            ease: "linear"
          }}
          style={{ 
            top: cloud.top, 
            opacity: cloud.opacity 
          }}
        >
          <Cloud />
        </motion.div>
      ))}
      
      {/* Home button */}
      <div className="w-full flex justify-end px-4 mb-4 md:mb-6 z-30">
        <motion.button
          onClick={() => navigate('/')}
          className="bg-blue-200 text-blue-500 px-4 py-1 rounded-md flex items-center text-sm font-poppins"
          whileHover={{ scale: 1.05, backgroundColor: "#bfdbfe" }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Home
        </motion.button>
      </div>

      {/* Main content container */}
      <div className="w-full max-w-md md:max-w-lg px-4 flex flex-col items-center z-10">
        <motion.h1
          className="text-2xl md:text-3xl font-bold text-white mb-6 md:mb-8 font-poppins text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          User Profile
        </motion.h1>
        
        {/* Tab selector */}
        <motion.div 
          className="flex w-full mb-6 md:mb-8 rounded-lg overflow-hidden"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <motion.button
            className={`flex-1 py-2 md:py-3 font-poppins text-sm md:text-base font-semibold ${activeTab === 'profile' ? 'bg-white text-blue-400' : 'bg-blue-400 text-white'} flex items-center justify-center`}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('profile')}
          >
            <img src="/profile.svg" alt="Profile" className="w-5 h-5 mr-2" />
            <span>Profile</span>
          </motion.button>
          <motion.button
            className={`flex-1 py-2 md:py-3 font-poppins text-sm md:text-base font-semibold ${activeTab === 'faq' ? 'bg-white text-blue-400' : 'bg-blue-400 text-white'} flex items-center justify-center`}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('faq')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>FAQ</span>
          </motion.button>
        </motion.div>
        
        {/* Content area with white background */}
        <motion.div
          className="w-full bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-lg shadow-md p-6 md:p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {activeTab === 'profile' ? (
            <motion.div 
              className="flex flex-col items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {/* User avatar */}
              <div className="w-32 h-32 rounded-full bg-blue-100 border-4 border-blue-300 flex items-center justify-center mb-6 overflow-hidden">
                {/* If user has avatar, show it, otherwise show initials */}
                {userData.avatar ? (
                  <img 
                    src={userData.avatar} 
                    alt={userData.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                    <img src="/profile.svg" alt="Profile" className="w-fit h-fit mr-2" />

                )}
              </div>
              
              {/* User details */}
              <h2 className="text-xl md:text-2xl font-bold text-white mb-2 font-poppins">
                {userData.name}
              </h2>
              
              <p className="text-white mb-6 font-poppins">
                {userData.email}
              </p>
              
              {/* Logout button */}
              <motion.button
                className="bg-blue-500 text-white px-6 py-2 rounded-md font-bold shadow-md font-poppins"
                whileHover={{ scale: 1.05, backgroundColor: "#3b82f6" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  localStorage.removeItem('user');
                  localStorage.removeItem('isAuthenticated');
                  navigate('/login');
                }}
              >
                Logout
              </motion.button>
            </motion.div>
          ) : (
            <motion.div 
              className="flex flex-col"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-lg md:text-xl font-bold text-white mb-8 font-poppins text-center">
                Help & FAQ
              </h2>
              
              {/* FAQ accordion */}
              {faqData.map((item, index) => (
                <motion.div
                  key={index}
                  className="mb-8 border-b border-blue-100 pb-4 last:border-b-0 last:pb-0"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <h3 className="text-md md:text-lg font-bold text-white mb-2 font-poppins">
                    {item.question}
                  </h3>
                  <p className="text-sm md:text-base text-white font-poppins">
                    {item.answer}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>
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
};

export default UserProfile;