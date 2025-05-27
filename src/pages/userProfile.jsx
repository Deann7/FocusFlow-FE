import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserProfile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [userData, setUserData] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const apiUrl = 'https://focus-flow-be.vercel.app/user';
  
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

  // Function to open the unified edit modal
  const openEditModal = () => {
    setEditForm({
      name: userData.name || '',
      email: userData.email || '',
      password: '',
      confirmPassword: ''
    });
    
    setError('');
    setSuccess('');
    setShowEditModal(true);
  };

  // Function to close the edit modal
  const closeEditModal = () => {
    setShowEditModal(false);
    setError('');
    setSuccess('');
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Function to update user data
  const updateUserData = async () => {
    if (loading) return;
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Validate inputs
      if (!editForm.name.trim()) {
        setError('Name cannot be empty');
        setLoading(false);
        return;
      }
      
      if (!editForm.email.trim()) {
        setError('Email cannot be empty');
        setLoading(false);
        return;
      }
      
      // Only validate password if it's provided (optional update)
      if (editForm.password.trim() && editForm.password !== editForm.confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }
      
      // Create a copy of userData for updates
      let updatedData = { ...userData };
      let updatePromises = [];
      
      // Update name if changed
      if (editForm.name !== userData.name) {
        const nameUpdateUrl = `${apiUrl}/update/name?id=${userData.id}&name=${encodeURIComponent(editForm.name)}`;
        updatePromises.push(axios.put(nameUpdateUrl));
        updatedData.name = editForm.name;
      }
      
      // Update email if changed
      if (editForm.email !== userData.email) {
        const emailUpdateUrl = `${apiUrl}/update/email?id=${userData.id}&email=${encodeURIComponent(editForm.email)}`;
        updatePromises.push(axios.put(emailUpdateUrl));
        updatedData.email = editForm.email;
      }
      
      // Update password if provided
      if (editForm.password.trim()) {
        const passwordUpdateUrl = `${apiUrl}/update/password?id=${userData.id}&password=${encodeURIComponent(editForm.password)}`;
        updatePromises.push(axios.put(passwordUpdateUrl));
      }
      
      // Only proceed if there are changes to update
      if (updatePromises.length === 0) {
        setError('No changes were made');
        setLoading(false);
        return;
      }
      
      // Execute all update requests
      const results = await Promise.allSettled(updatePromises);
      
      // Check if all promises were fulfilled
      const allSuccessful = results.every(result => result.status === 'fulfilled' && result.value.data.success);
      
      if (allSuccessful) {
        // Update localStorage
        localStorage.setItem('user', JSON.stringify(updatedData));
        setUserData(updatedData);
        
        setSuccess('Your profile has been updated successfully!');
        
        // Close modal after a short delay
        setTimeout(() => {
          closeEditModal();
        }, 2000);
      } else {
        // Find first error
        const firstError = results.find(result => result.status === 'rejected' || !result.value.data.success);
        if (firstError && firstError.status === 'fulfilled') {
          setError(firstError.value.data.message || 'Failed to update profile');
        } else {
          setError('Failed to update profile');
        }
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      
      if (err.response && err.response.data) {
        setError(err.response.data.message || 'Error updating profile');
      } else {
        setError('An error occurred while updating your profile');
      }
    } finally {
      setLoading(false);
    }
  };

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
      answer: "Yes, you can update your password anytime from the User Profile section by clicking the Edit Profile button."
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
          onClick={() => navigate('/landingPage')}
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
              <div className="w-full space-y-4 mb-6">
                {/* Name */}
                <div className="bg-white bg-opacity-20 p-3 rounded-md">
                  <div className="text-blue-100 text-xs font-medium mb-1">Name</div>
                  <div className="text-white font-medium">{userData.name}</div>
                </div>
                
                {/* Email */}
                <div className="bg-white bg-opacity-20 p-3 rounded-md">
                  <div className="text-blue-100 text-xs font-medium mb-1">Email</div>
                  <div className="text-white font-medium">{userData.email}</div>
                </div>
                
                {/* Password */}
                <div className="bg-white bg-opacity-20 p-3 rounded-md">
                  <div className="text-blue-100 text-xs font-medium mb-1">Password</div>
                  <div className="text-white font-medium">••••••••</div>
                </div>
              </div>
              
              {/* Edit Profile Button */}
              <motion.button
                className="bg-blue-400 text-white px-6 py-2 rounded-md font-bold shadow-md font-poppins mb-4 w-full flex items-center justify-center"
                whileHover={{ scale: 1.02, backgroundColor: "#60a5fa" }}
                whileTap={{ scale: 0.98 }}
                onClick={openEditModal}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Edit Profile
              </motion.button>
              
              {/* Logout button */}
              <motion.button
                className="bg-blue-500 text-white px-6 py-2 rounded-md font-bold shadow-md font-poppins w-full"
                whileHover={{ scale: 1.02, backgroundColor: "#3b82f6" }}
                whileTap={{ scale: 0.98 }}
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
      
      {/* Unified Edit Profile Modal */}
      <AnimatePresence>
        {showEditModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop dengan z-index yang lebih rendah */}
            <motion.div 
              className="absolute inset-0 bg-black bg-opacity-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeEditModal}
            />
            
            {/* Modal dengan position relative agar tetap di dalam parent flex */}
            <motion.div 
              className="relative bg-white rounded-lg shadow-xl p-6 w-11/12 max-w-md m-4"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-blue-500 font-poppins">
                  Edit Profile
                </h3>
                <button 
                  className="text-gray-400 hover:text-gray-600"
                  onClick={closeEditModal}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {error && (
                <div className="bg-red-100 text-red-600 p-3 rounded-md mb-4 text-sm">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="bg-green-100 text-green-600 p-3 rounded-md mb-4 text-sm">
                  {success}
                </div>
              )}
              
              <div className="space-y-4">
                {/* Name input */}
                <div>
                  <label className="block text-blue-500 text-sm font-semibold mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    className="w-full p-3 bg-blue-50 border border-blue-200 rounded text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    placeholder="Enter your name"
                    value={editForm.name}
                    onChange={handleInputChange}
                  />
                </div>
                
                {/* Email input */}
                <div>
                  <label className="block text-blue-500 text-sm font-semibold mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    className="w-full p-3 bg-blue-50 border border-blue-200 rounded text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    placeholder="Enter your email"
                    value={editForm.email}
                    onChange={handleInputChange}
                  />
                </div>
                
                {/* Password input (optional) */}
                <div>
                  <label className="block text-blue-500 text-sm font-semibold mb-1">
                    New Password (optional)
                  </label>
                  <input
                    type="password"
                    name="password"
                    className="w-full p-3 bg-blue-50 border border-blue-200 rounded text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    placeholder="Leave blank to keep current password"
                    value={editForm.password}
                    onChange={handleInputChange}
                  />
                </div>
                
                {/* Confirm password input */}
                <div>
                  <label className="block text-blue-500 text-sm font-semibold mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    className="w-full p-3 bg-blue-50 border border-blue-200 rounded text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    placeholder="Confirm new password"
                    value={editForm.confirmPassword}
                    onChange={handleInputChange}
                    disabled={!editForm.password}
                  />
                </div>
                
                {/* Action buttons */}
                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md font-poppins hover:bg-gray-300 text-sm"
                    onClick={closeEditModal}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 bg-blue-400 text-white rounded-md font-poppins hover:bg-blue-500 text-sm flex items-center"
                    onClick={updateUserData}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Updating...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserProfile;