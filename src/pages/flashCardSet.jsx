import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const FlashCardSet = () => {
  const navigate = useNavigate();
  const [flashcardSets, setFlashcardSets] = useState([]);
  const [showAddInput, setShowAddInput] = useState(false);
  const [newSetName, setNewSetName] = useState('');

  // Simulate loading flashcard sets from API/database
  useEffect(() => {
    // This would be replaced with an actual API call
    // For now, we'll use empty array or mock data
    setFlashcardSets([
      // Example data (you can remove for production)
      /*
      {
        id: 1,
        name: 'Biology Terms',
        cards: [
          { id: 1, front: 'Photosynthesis', back: 'The process by which plants use sunlight to synthesize foods from carbon dioxide and water' },
          { id: 2, front: 'Mitosis', back: 'A process of cell division that results in two identical daughter cells' }
        ]
      }
      */
    ]);
  }, []);

  const handleAddSet = (e) => {
    e.preventDefault();
    
    if (!newSetName.trim()) return;
    
    // Create new set object
    const newSet = {
      id: Date.now(), // We'd get an ID from the backend in a real app
      name: newSetName,
      cards: []
    };
    
    // Add the new set to our state
    setFlashcardSets([...flashcardSets, newSet]);
    
    // Clear form and hide input
    setNewSetName('');
    setShowAddInput(false);
  };

  const handleViewSet = (setId) => {
    // Navigate to the flashcard set detail view
    navigate(`/flashcardset/${setId}`);
  };

  // New function to handle set deletion
  const handleDeleteSet = (e, setId) => {
    // Stop propagation to prevent navigating to the set detail view
    e.stopPropagation();
    
    // In a real app, you'd call an API to delete the set
    // For now, we'll just filter it out from the state
    const updatedSets = flashcardSets.filter(set => set.id !== setId);
    setFlashcardSets(updatedSets);
  };

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
      
      {/* Header with Home Button */}
      <div className="w-full flex justify-end items-center px-4 mb-6 z-30">
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
            />
          </div>
        </motion.div>
        
        {/* Add New Set Input (directly in the list) */}
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
              />
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md font-poppins hover:bg-gray-300 text-sm"
                  onClick={() => setShowAddInput(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-400 text-white rounded-md font-poppins hover:bg-blue-500 text-sm"
                  disabled={!newSetName.trim()}
                >
                  Create Set
                </button>
              </div>
            </form>
          </motion.div>
        )}
        
        {/* Flashcard Sets List */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4 mb-10"
        >
          {flashcardSets.length === 0 && !showAddInput ? (
            <motion.div 
              className="bg-white bg-opacity-70 backdrop-filter backdrop-blur-sm rounded-lg shadow-md p-8 text-center"
              variants={itemVariants}
            >
              <h3 className="text-lg font-semibold text-blue-500 mb-2 font-poppins">No Flashcard Sets Yet</h3>
              <p className="text-blue-400 font-poppins text-sm">Create your first flashcard set by clicking the "+" button above.</p>
            </motion.div>
          ) : (
            flashcardSets.map(set => (
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
                      {set.cards && set.cards.length > 0 
                        ? `${set.cards.length} cards` 
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