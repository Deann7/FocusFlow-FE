import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';

const StudyFlashCard = () => {
  const navigate = useNavigate();
  const { setId } = useParams();
  const [flashcardSet, setFlashcardSet] = useState(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch flashcard set data
  useEffect(() => {
    const fetchFlashcardSet = async () => {
      try {
        setIsLoading(true);
        
        // This would be replaced with an actual API call in production
        // For now, let's simulate loading
        setTimeout(() => {
          // Mock data - would be replaced with API call
          const mockSet = {
            id: setId,
            name: "Biology Terms",
            cards: [
              { id: 1, front: "What is photosynthesis?", back: "The process by which plants use sunlight to synthesize foods from carbon dioxide and water" },
              { id: 2, front: "What is mitosis?", back: "A process of cell division that results in two identical daughter cells" },
              { id: 3, front: "What is cellular respiration?", back: "The process by which organisms break down glucose to release energy" }
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
  
  const handleNextCard = () => {
    if (flashcardSet && currentCardIndex < flashcardSet.cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setShowAnswer(false);
    }
  };
  
  const handlePrevCard = () => {
    if (flashcardSet && currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setShowAnswer(false);
    }
  };
  
  const flipCard = () => {
    setShowAnswer(!showAnswer);
  };
  
  const handleBackToSet = () => {
    navigate(`/flashcard/${setId}`);
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
          Study Flashcards
        </motion.h1>
      </div>
      
      {/* Main Content */}
      <div className="w-full max-w-md px-4 mx-auto flex flex-col z-10">
        {/* Set Info Box */}
        <motion.div 
          className="bg-white bg-opacity-40 backdrop-filter backdrop-blur-sm rounded-lg shadow-md p-6 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-2">
            <motion.button
              onClick={handleBackToSet}
              className="bg-blue-400 text-white px-3 py-1 rounded-md flex items-center text-sm font-poppins"
              whileHover={{ scale: 1.05, backgroundColor: "#60a5fa" }}
              whileTap={{ scale: 0.95 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back
            </motion.button>
            
            <h2 className="text-lg font-bold text-white font-poppins text-center flex-1">
              {isLoading ? "Loading..." : flashcardSet?.name}
            </h2>
            
            <div className="w-8"></div> {/* Empty div for spacing balance */}
          </div>
          
          <div className="flex justify-center text-white text-sm">
            {!isLoading && flashcardSet?.cards && (
              <p>Card {currentCardIndex + 1} of {flashcardSet.cards.length}</p>
            )}
          </div>
        </motion.div>
        
        {/* Flashcard Display - Flippable Card */}
        {isLoading ? (
          <motion.div 
            className="bg-white bg-opacity-70 rounded-lg shadow-md p-8 flex items-center justify-center h-64 md:h-80"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          </motion.div>
        ) : flashcardSet?.cards?.length > 0 ? (
          <div className="perspective-1000 w-full h-64 md:h-80 mb-6">
            <motion.div 
              className={`w-full h-full relative cursor-pointer transition-transform flip-card ${showAnswer ? 'flipped' : ''}`}
              onClick={flipCard}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
            >
              {/* Front side - Question */}
              <div className={`absolute inset-0 w-full h-full bg-blue-400 bg-opacity-70 backdrop-filter backdrop-blur-sm rounded-lg shadow-md p-6 flex items-center justify-center backface-hidden ${showAnswer ? 'hidden' : ''}`}>
                <div className="text-center">
                  <div className="text-xs text-white font-semibold mb-4">QUESTION</div>
                  <p className="text-white font-poppins text-xl font-semibold">
                    {flashcardSet.cards[currentCardIndex].front}
                  </p>
                  <div className="absolute bottom-3 text-center left-0 right-0 text-xs text-white">
                    Click to see answer
                  </div>
                </div>
              </div>
              
              {/* Back side - Answer */}
              <div className={`absolute inset-0 w-full h-full bg-white bg-opacity-90 backdrop-filter backdrop-blur-sm rounded-lg shadow-md p-6 flex items-center justify-center backface-hidden ${showAnswer ? '' : 'hidden'}`}>
                <div className="text-center">
                  <div className="text-xs text-blue-500 font-semibold mb-4">ANSWER</div>
                  <p className="text-blue-500 font-poppins text-lg">
                    {flashcardSet.cards[currentCardIndex].back}
                  </p>
                  <div className="absolute bottom-3 text-center left-0 right-0 text-xs text-blue-400">
                    Click to see question
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : (
          <motion.div 
            className="bg-white bg-opacity-70 rounded-lg shadow-md p-8 text-center mb-6 h-64 md:h-80"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex flex-col items-center justify-center h-full">
              <h3 className="text-lg font-semibold text-blue-500 mb-2 font-poppins">No Cards Yet</h3>
              <p className="text-blue-400 font-poppins text-sm">This set doesn't have any cards yet.</p>
            </div>
          </motion.div>
        )}
        
        {/* Navigation Controls */}
        {flashcardSet?.cards?.length > 0 && (
          <motion.div 
            className="flex justify-between mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <motion.button
              onClick={handlePrevCard}
              className="bg-blue-400 text-white px-6 py-2 rounded-md flex items-center font-poppins disabled:opacity-50"
              whileHover={{ scale: 1.05, backgroundColor: "#60a5fa" }}
              whileTap={{ scale: 0.95 }}
              disabled={currentCardIndex === 0}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </motion.button>
            
            <motion.button
              onClick={handleNextCard}
              className="bg-blue-400 text-white px-6 py-2 rounded-md flex items-center font-poppins disabled:opacity-50"
              whileHover={{ scale: 1.05, backgroundColor: "#60a5fa" }}
              whileTap={{ scale: 0.95 }}
              disabled={!flashcardSet || currentCardIndex === flashcardSet.cards.length - 1}
            >
              Next
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>
          </motion.div>
        )}
        
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

export default StudyFlashCard;
