import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const FlashCardSet = () => {
  const navigate = useNavigate();
  const [flashcardSets, setFlashcardSets] = useState([]);
  const [showAddInput, setShowAddInput] = useState(false);
  const [newSetName, setNewSetName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: 'success'
  });
  
  // API URL - use the same port as your other endpoints
  const apiUrl = 'https://focus-flow-be.vercel.app';

  // Function to get user ID from localStorage
  const getUserId = () => {
    try {
      const userData = localStorage.getItem('user');
      if (!userData) {
        return null;
      }
      
      const user = JSON.parse(userData);
      if (!user || !user.id) {
        return null;
      }
      
      return user.id;
    } catch (error) {
      console.error("Error getting user ID:", error);
      return null;
    }
  };

  // Function to show notification
  const showNotification = (message, type = 'success', duration = 5000) => {
    setNotification({
      show: true,
      message,
      type
    });

    setTimeout(() => {
      setNotification({
        show: false,
        message: '',
        type: 'success'
      });
    }, duration);
  };

  // Load flashcard sets from API
  useEffect(() => {
    const fetchFlashcardSets = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const userId = getUserId();
        if (!userId) {
          setError("You must be logged in to view your flashcard sets");
          setIsLoading(false);
          return;
        }
        
        const response = await axios.get(`${apiUrl}/flashcard/set/user/${userId}`, {
          timeout: 8000
        });
        
        if (response.data.success) {
          setFlashcardSets(response.data.payload);
          console.log("Flashcard sets loaded:", response.data.payload);
        } else {
          setError(response.data.message || "Failed to load flashcard sets");
        }
      } catch (error) {
        console.error("Error fetching flashcard sets:", error);
        if (!error.response) {
          setError("Network error - please check your connection");
        } else {
          setError(error.response.data?.message || "An error occurred while loading flashcard sets");
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFlashcardSets();
  }, []);

  // Create a new flashcard set
  const handleAddSet = async (e) => {
    e.preventDefault();
    
    if (!newSetName.trim()) return;
    
    const userId = getUserId();
    if (!userId) {
      showNotification("You must be logged in to create a set", "error");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await axios.post(`${apiUrl}/flashcard/set`, {
        user_id: userId,
        name: newSetName,
        description: ""
      });
      
      if (response.data.success) {
        // Add new set to the list
        setFlashcardSets([response.data.payload, ...flashcardSets]);
        showNotification("Flashcard set created successfully!", "success");
        
        // Clear form and hide input
        setNewSetName('');
        setShowAddInput(false);
      } else {
        showNotification(response.data.message || "Failed to create flashcard set", "error");
      }
    } catch (error) {
      console.error("Error creating flashcard set:", error);
      if (!error.response) {
        showNotification("Network error - please check your connection", "error");
      } else {
        showNotification(error.response.data?.message || "An error occurred while creating the set", "error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Navigate to the flashcard set detail view
  const handleViewSet = (setId) => {
    navigate(`/flashcardset/${setId}`);
  };

  // Delete a flashcard set
  const handleDeleteSet = async (e, setId) => {
    e.stopPropagation();
    
    setIsLoading(true);
    
    try {
      const response = await axios.delete(`${apiUrl}/flashcard/set/${setId}`);
      
      if (response.data.success) {
        // Remove set from the list
        const updatedSets = flashcardSets.filter(set => set.id !== setId);
        setFlashcardSets(updatedSets);
        showNotification("Flashcard set deleted successfully!", "success");
      } else {
        showNotification(response.data.message || "Failed to delete flashcard set", "error");
      }
    } catch (error) {
      console.error("Error deleting flashcard set:", error);
      if (!error.response) {
        showNotification("Network error - please check your connection", "error");
      } else {
        showNotification(error.response.data?.message || "An error occurred while deleting the set", "error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Filter sets based on search query
  const filteredSets = searchQuery.trim() 
    ? flashcardSets.filter(set => 
        set.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : flashcardSets;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1 
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const Cloud = () => (
    <img src="/cloud.svg" alt="Cloud" className="opacity-80" />
  );

  const cloudPositions = [
    { top: '10%', delay: 0, direction: 'right-to-left', opacity: 0.7 },
    { top: '30%', delay: 2, direction: 'left-to-right', opacity: 0.5 },
    { top: '50%', delay: 1, direction: 'right-to-left', opacity: 0.6 },
    { top: '70%', delay: 3, direction: 'left-to-right', opacity: 0.4 },
    { top: '90%', delay: 2, direction: 'right-to-left', opacity: 0.7 },
  ];

  return (
    <div className="w-full min-h-screen bg-blue-300 flex flex-col items-center justify-start pt-5 md:pt-10 overflow-y-auto relative">
      {/* Background Clouds */}
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
      
      {/* Notification popup */}
      <AnimatePresence>
        {notification.show && (
          <motion.div 
            className={`fixed top-4 right-4 z-50 py-4 px-6 rounded-xl shadow-xl backdrop-blur-md 
              ${notification.type === 'success' ? 'bg-green-500/30 border border-green-400/30' : 
                notification.type === 'error' ? 'bg-red-500/30 border border-red-400/30' : 
                'bg-blue-500/30 border border-blue-400/30'
              } text-white max-w-sm`}
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            transition={{ type: "spring", damping: 20 }}
          >
            <div className="flex items-start">
              <div className={`p-2 rounded-full mr-3 flex-shrink-0
                ${notification.type === 'success' ? 'bg-green-500/30' : 
                  notification.type === 'error' ? 'bg-red-500/30' : 
                  'bg-blue-500/30'}`}
              >
                {notification.type === 'success' && (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                )}
                {notification.type === 'error' && (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                )}
                {notification.type !== 'success' && notification.type !== 'error' && (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                )}
              </div>
              <div>
                <h4 className="font-medium mb-1">
                  {notification.type === 'success' ? 'Success!' : 
                  notification.type === 'error' ? 'Error!' : 'Info'}
                </h4>
                <p className="text-white/90 text-sm">{notification.message}</p>
              </div>
            </div>
            <motion.div 
              className="h-1 bg-white/30 absolute bottom-0 left-0 rounded-full"
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 5 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Header with Home Button */}
      <div className="w-full flex justify-end items-center px-4 mb-6 z-30">
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
      
      <div className="w-full flex justify-center items-center px-4 mb-6 z-30">
        <motion.h1
          className="text-2xl md:text-3xl font-bold text-white font-poppins"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          >
          Flashcards
        </motion.h1>
      </div>
      
      {/* Main Content Container */}
      <div className="w-full max-w-md px-4 mx-auto flex flex-col z-10">
        {/* My Flashcard Sets and Add Button */}
        <motion.div 
          className="bg-white bg-opacity-40 backdrop-filter backdrop-blur-sm rounded-lg shadow-md p-6 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white font-poppins">MY Flashcard Sets</h2>
            <motion.button
              className="bg-white bg-opacity-70 text-blue-500 w-8 h-8 rounded-full flex items-center justify-center shadow-md"
              whileHover={{ scale: 1.1, backgroundColor: "#ffffff" }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowAddInput(!showAddInput)}
              disabled={isLoading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </motion.button>
          </div>
          
          {/* Input to search flashcards */}
          <div className="mb-4">
            <input
              type="text"
              className="w-full p-2 bg-white bg-opacity-70 border border-blue-200 rounded text-blue-600 placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="Search your flashcard sets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled={isLoading}
            />
          </div>
          
          {/* Display error message if any */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <p className="font-poppins text-sm">{error}</p>
            </div>
          )}
        </motion.div>
        
        {/* Add New Set Input */}
        <AnimatePresence>
          {showAddInput && (
            <motion.div
              className="bg-white bg-opacity-70 backdrop-filter backdrop-blur-sm rounded-lg shadow-md p-5 mb-4"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <form onSubmit={handleAddSet} className="space-y-3">
                <h3 className="text-md font-bold text-blue-500 font-poppins mb-2">Create New Set</h3>
                <input
                  type="text"
                  className="w-full p-3 bg-white bg-opacity-80 border border-blue-200 rounded text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  placeholder="Enter set name"
                  value={newSetName}
                  onChange={(e) => setNewSetName(e.target.value)}
                  autoFocus
                  disabled={isLoading}
                />
                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md font-poppins hover:bg-gray-300 text-sm"
                    onClick={() => setShowAddInput(false)}
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-400 text-white rounded-md font-poppins hover:bg-blue-500 text-sm"
                    disabled={!newSetName.trim() || isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <motion.div 
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                          className="w-4 h-4 rounded-full border-2 border-white border-t-transparent mr-2"
                        />
                        Creating...
                      </div>
                    ) : 'Create Set'}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Loading indicator */}
        {isLoading && !showAddInput && (
          <div className="flex justify-center my-8">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              className="w-10 h-10 rounded-full border-4 border-blue-400 border-t-transparent"
            />
          </div>
        )}
        
        {/* Flashcard Sets List */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4 mb-10"
        >
          {!isLoading && filteredSets.length === 0 && !showAddInput ? (
            <motion.div 
              className="bg-white bg-opacity-70 backdrop-filter backdrop-blur-sm rounded-lg shadow-md p-8 text-center"
              variants={itemVariants}
            >
              <h3 className="text-lg font-semibold text-blue-500 mb-2 font-poppins">No Flashcard Sets Yet</h3>
              <p className="text-blue-400 font-poppins text-sm">Create your first flashcard set by clicking the "+" button above.</p>
            </motion.div>
          ) : (
            filteredSets.map(set => (
              <motion.div
                key={set.id}
                className="bg-white bg-opacity-70 backdrop-filter backdrop-blur-sm rounded-lg shadow-md p-6 cursor-pointer border border-transparent hover:border-blue-200"
                variants={itemVariants}
                whileHover={{ scale: 1.02, boxShadow: "0 8px 15px rgba(0, 0, 0, 0.1)" }}
                onClick={() => handleViewSet(set.id)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-bold text-blue-500 mb-1 font-poppins">{set.name}</h3>
                    <p className="text-sm text-blue-400 font-poppins">
                      {set.card_count > 0 
                        ? `${set.card_count} cards` 
                        : "This set doesn't have any cards yet."}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {/* Delete button */}
                    <motion.button
                      className="bg-red-100 text-red-500 rounded-full w-8 h-8 flex items-center justify-center"
                      whileHover={{ scale: 1.1, backgroundColor: "#fee2e2" }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => handleDeleteSet(e, set.id)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </motion.button>
                    {/* View button */}
                    <div className="bg-blue-100 hover:bg-white text-blue-400 rounded-full w-10 h-10 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
        
        {/* Footer */}
        <motion.div
          className="z-20 font-bold mb-10 text-center text-Yellow_Pixel text-sm font-poppins"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          © 2025 FocusFlow. All rights reserved.
        </motion.div>
      </div>
    </div>
  );
};

export default FlashCardSet;