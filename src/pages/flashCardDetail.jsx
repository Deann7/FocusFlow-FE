import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const FlashCardDetail = () => {
  const navigate = useNavigate();
  const { setId } = useParams();
  const [flashcardSet, setFlashcardSet] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCard, setNewCard] = useState({ front: '', back: '' });
  const [error, setError] = useState(null);
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
  
  // Fetch flashcard set data with cards
  useEffect(() => {
    const fetchFlashcardSet = async () => {
      if (!setId) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await axios.get(`${apiUrl}/flashcard/set/${setId}/cards`, {
          timeout: 8000
        });
        
        if (response.data.success) {
          setFlashcardSet(response.data.payload);
          console.log("Flashcard set loaded:", response.data.payload);
        } else {
          setError(response.data.message || "Failed to load flashcard set");
        }
      } catch (error) {
        console.error("Error fetching flashcard set:", error);
        if (!error.response) {
          setError("Network error - please check your connection");
        } else {
          setError(error.response.data?.message || "An error occurred while loading the flashcard set");
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFlashcardSet();
  }, [setId]);
  
  // Add a new card to the set
  const handleAddCard = async (e) => {
    e.preventDefault();
    
    if (!newCard.front.trim() || !newCard.back.trim()) return;
    
    setIsLoading(true);
    
    try {
      const response = await axios.post(`${apiUrl}/flashcard/card`, {
        set_id: setId,
        front: newCard.front,
        back: newCard.back
      });
      
      if (response.data.success) {
        // Update the set with the new card
        const newCardFromServer = response.data.payload;
        
        setFlashcardSet({
          ...flashcardSet,
          cards: [...(flashcardSet.cards || []), newCardFromServer]
        });
        
        // Reset form
        setNewCard({ front: '', back: '' });
        setShowAddForm(false);
        showNotification("Card added successfully!", "success");
      } else {
        showNotification(response.data.message || "Failed to add card", "error");
      }
    } catch (error) {
      console.error("Error adding card:", error);
      if (!error.response) {
        showNotification("Network error - please check your connection", "error");
      } else {
        showNotification(error.response.data?.message || "An error occurred while adding the card", "error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Navigate back to flashcard sets
  const handleBackToSets = () => {
    navigate('/flashcardset');
  };
  
  // Navigate to study mode
  const handleStudySet = () => {
    navigate(`/studyflashcard/${setId}`);
  };
  
  // Handle card deletion
  const handleDeleteCard = async (cardId) => {
    setIsLoading(true);
    
    try {
      const response = await axios.delete(`${apiUrl}/flashcard/card/${cardId}`);
      
      if (response.data.success) {
        // Remove card from the set
        const updatedCards = flashcardSet.cards.filter(card => card.id !== cardId);
        setFlashcardSet({
          ...flashcardSet,
          cards: updatedCards
        });
        showNotification("Card deleted successfully!", "success");
      } else {
        showNotification(response.data.message || "Failed to delete card", "error");
      }
    } catch (error) {
      console.error("Error deleting card:", error);
      if (!error.response) {
        showNotification("Network error - please check your connection", "error");
      } else {
        showNotification(error.response.data?.message || "An error occurred while deleting the card", "error");
      }
    } finally {
      setIsLoading(false);
    }
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
      
      {/* Title */}
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
      
      {/* Main Content */}
      <div className="w-full max-w-md px-4 mx-auto flex flex-col z-10">
        {/* Set Info & Navigation */}
        <motion.div 
          className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-sm rounded-lg shadow-md p-6 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-4">
            <motion.button
              onClick={handleBackToSets}
              className="bg-blue-400 text-white px-3 py-1 rounded-md flex items-center text-sm font-poppins"
              whileHover={{ scale: 1.05, backgroundColor: "#60a5fa" }}
              whileTap={{ scale: 0.95 }}
              disabled={isLoading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back
            </motion.button>
            
            <h2 className="text-xl font-bold text-white font-poppins">
              {isLoading ? "Loading..." : flashcardSet?.name}
            </h2>
            
            <div className="flex space-x-2">
              <motion.button
                className="bg-white bg-opacity-90 text-blue-500 w-8 h-8 rounded-full flex items-center justify-center shadow-md"
                whileHover={{ scale: 1.1, backgroundColor: "#ffffff" }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowAddForm(!showAddForm)}
                disabled={isLoading}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </motion.button>
              
              <motion.button
                className="bg-blue-400 text-white w-8 h-8 rounded-full flex items-center justify-center border-2 border-white shadow-md"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleStudySet}
                disabled={isLoading || !flashcardSet || !flashcardSet.cards || flashcardSet.cards.length === 0}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </motion.button>
            </div>
          </div>
          
          {/* Display error message if any */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-2">
              <p className="font-poppins text-sm">{error}</p>
            </div>
          )}
        </motion.div>
        
        {/* Add Card Form */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              className="bg-white bg-opacity-70 backdrop-filter backdrop-blur-sm rounded-lg shadow-md p-5 mb-4"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <form onSubmit={handleAddCard} className="space-y-3">
                <h3 className="text-md font-bold text-blue-500 font-poppins mb-2">Add New Card</h3>
                
                <div>
                  <label className="block text-blue-500 text-sm font-semibold mb-1">Question/Front:</label>
                  <input
                    type="text"
                    className="w-full p-3 bg-white border border-blue-200 rounded text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    placeholder="Enter question"
                    value={newCard.front}
                    onChange={(e) => setNewCard({...newCard, front: e.target.value})}
                    autoFocus
                    disabled={isLoading}
                  />
                </div>
                
                <div>
                  <label className="block text-blue-500 text-sm font-semibold mb-1">Answer/Back:</label>
                  <textarea
                    className="w-full p-3 bg-white border border-blue-200 rounded text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    placeholder="Enter answer"
                    rows="3"
                    value={newCard.back}
                    onChange={(e) => setNewCard({...newCard, back: e.target.value})}
                    disabled={isLoading}
                  />
                </div>
                
                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md font-poppins hover:bg-gray-300 text-sm"
                    onClick={() => setShowAddForm(false)}
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-400 text-white rounded-md font-poppins hover:bg-blue-500 text-sm"
                    disabled={!newCard.front.trim() || !newCard.back.trim() || isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <motion.div 
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                          className="w-4 h-4 rounded-full border-2 border-white border-t-transparent mr-2"
                        />
                        Adding...
                      </div>
                    ) : 'Add Card'}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Loading indicator */}
        {isLoading && !showAddForm && (
          <div className="flex justify-center my-8">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              className="w-10 h-10 rounded-full border-4 border-blue-400 border-t-transparent"
            />
          </div>
        )}
        
        {/* Cards List */}
        <div className="space-y-4 mb-10">
          {!isLoading && flashcardSet?.cards?.length > 0 ? (
            flashcardSet.cards.map((card, index) => (
              <motion.div
                key={card.id}
                className="bg-white bg-opacity-70 backdrop-filter backdrop-blur-sm rounded-lg shadow-md p-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-blue-500 font-bold">Card {index + 1}</h3>
                  <motion.button
                    className="text-red-400 p-1 rounded hover:bg-red-50"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDeleteCard(card.id)}
                    disabled={isLoading}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </motion.button>
                </div>
                <div className="mb-3">
                  <h3 className="text-blue-500 font-bold mb-1">Question:</h3>
                  <p className="text-blue-600">{card.front}</p>
                </div>
                <div>
                  <h3 className="text-blue-500 font-bold mb-1">Answer:</h3>
                  <p className="text-blue-600">{card.back}</p>
                </div>
              </motion.div>
            ))
          ) : !isLoading && (
            <motion.div 
              className="bg-white bg-opacity-70 backdrop-filter backdrop-blur-sm rounded-lg shadow-md p-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3 className="text-lg font-semibold text-blue-500 mb-2 font-poppins">No Cards Yet</h3>
              <p className="text-blue-400 font-poppins text-sm">This set doesn't have any cards yet. Add cards using the "+" button above.</p>
            </motion.div>
          )}
        </div>
        
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

export default FlashCardDetail;
