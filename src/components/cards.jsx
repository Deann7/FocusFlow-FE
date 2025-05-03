import React from 'react';
import { motion } from 'framer-motion';

const Cards = ({ 
  note, 
  type = 'active', 
  onComplete, 
  onDelete,
  formatDate,
  isPastDue
}) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    },
    hover: {
      scale: 1.03,
      boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.3)",
      transition: { duration: 0.2 }
    }
  };

  const cardStyles = type === 'active' 
    ? "bg-[#5c4033] border-2 border-[#d5cea3]" 
    : "bg-[#3c2a21] border-2 border-[#5c4033] opacity-90";

  const contentBg = type === 'active' 
    ? "bg-[#3c2a21]" 
    : "bg-[#2c2018]";

  const badgeLabel = type === 'active' 
    ? (isPastDue && isPastDue(note.deadline) ? "OVERDUE" : null) 
    : "COMPLETED";

  const badgeColor = type === 'active' 
    ? "bg-red-600 text-white" 
    : "bg-[#1a120b] text-[#d5cea3]";

  return (
    <motion.div
      className={`${cardStyles} rounded-lg p-4 shadow-md relative overflow-hidden`}
      variants={cardVariants}
      whileHover="hover"
    >
      {badgeLabel && (
        <div className={`absolute top-0 right-0 ${badgeColor} text-xs px-2 py-1 m-1 rounded`}>
          {badgeLabel}
        </div>
      )}
      
      <h3 className="text-xl font-bold text-[#d5cea3] mb-2">{note.title}</h3>
      
      <div className={`text-[#d5cea3] ${type === 'completed' ? 'opacity-80' : 'opacity-90'} mb-3`}>
        <p className="text-sm mb-1">
          <span className="font-bold">
            {type === 'active' ? 'Deadline:' : 'Deadline was:'}
          </span> {formatDate ? formatDate(note.deadline) : note.deadline}
        </p>
        <p className="text-sm">
          <span className="font-bold">Created:</span> {formatDate ? formatDate(note.created_at) : note.created_at}
        </p>
      </div>
      
      <div className={`${contentBg} p-3 rounded-md mb-4 min-h-24 max-h-32 overflow-y-auto`}>
        <p className={`text-[#d5cea3] ${type === 'completed' ? 'opacity-80' : ''}`}>
          {note.description || "No description provided"}
        </p>
      </div>
      
      <div className="flex justify-end">
        {type === 'active' ? (
          <motion.button
            className="bg-[#1a120b] text-[#d5cea3] py-2 px-4 rounded-md border border-[#d5cea3] hover:bg-[#2c2018]"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onComplete && onComplete(note.id)}
          >
            Mark Complete
          </motion.button>
        ) : (
          <motion.button
            className="bg-[#1a120b] text-red-400 py-2 px-4 rounded-md border border-red-400 hover:bg-[#2c2018]"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onDelete && onDelete(note.id)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default Cards;