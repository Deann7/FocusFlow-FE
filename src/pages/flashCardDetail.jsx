import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';

const FlashCardDetail = () => {
  const navigate = useNavigate();
  const { setId } = useParams();
  const [flashcardSet, setFlashcardSet] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCard, setNewCard] = useState({ front: '', back: '' });
  
  // Fetch flashcard set data
  useEffect(() => {
    const fetchFlashcardSet = async () => {
      try {
        setIsLoading(true);
        
        // This would be replaced with an actual API call in production
        // For now, let's simulate loading
        setTimeout(() => {
          // This is mock data, replace with actual API call
          const mockSet = {
            id: setId,
            name: "Biology Terms",
            cards: [
              { id: 1, front: "What is photosynthesis?", back: "The process by which plants use sunlight to synthesize foods from carbon dioxide and water" },
              { id: 2, front: "What is mitosis?", back: "A process of cell division that results in two identical daughter cells" }
            ]
          };
          
          setFlashcardSet(mockSet);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching flashcard set:", error);
        setIsLoading(false);
      }
    };
    
    fetchFlashcardSet();
  }, [setId]);
  
  const handleAddCard = (e) => {
    e.preventDefault();
    
    if (!newCard.front.trim() || !newCard.back.trim()) return;
    
    // Create new card and add to set
    const newCardObj = {
      id: Date.now(),
      front: newCard.front,
      back: newCard.back
    };
    
    // Update the set with the new card
    setFlashcardSet({
      ...flashcardSet,
      cards: [...(flashcardSet.cards || []), newCardObj]
    });
    
    // Reset form
    setNewCard({ front: '', back: '' });
    setShowAddForm(false);
  };

  const handleBackToSets = () => {
    navigate('/flashcardset');
  };
  
  const handleStudySet = (setId) => {
    navigate(`/studyflashcard/${setId}`);
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
                disabled={!flashcardSet || !flashcardSet.cards || flashcardSet.cards.length === 0}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </motion.button>
            </div>
          </div>
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
                  />
                </div>
                
                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md font-poppins hover:bg-gray-300 text-sm"
                    onClick={() => setShowAddForm(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-400 text-white rounded-md font-poppins hover:bg-blue-500 text-sm"
                    disabled={!newCard.front.trim() || !newCard.back.trim()}
                  >
                    Add Card
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Cards List */}
        <div className="space-y-4 mb-10">
          {isLoading ? (
            <motion.div 
              className="bg-white bg-opacity-70 rounded-lg shadow-md p-8 flex items-center justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
            </motion.div>
          ) : flashcardSet?.cards?.length > 0 ? (
            flashcardSet.cards.map((card, index) => (
              <motion.div
                key={card.id}
                className="bg-white bg-opacity-70 backdrop-filter backdrop-blur-sm rounded-lg shadow-md p-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
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
          ) : (
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
