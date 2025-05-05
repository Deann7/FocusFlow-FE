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

  const adjustToWIB = (dateString) => {
    const date = new Date(dateString);
    date.setHours(date.getHours() - 7);
    return date;
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

  const calculateTimeRemaining = () => {
    if (!note.deadline || type !== 'active') return null;
    
    const now = new Date();
    const deadline = adjustToWIB(note.deadline);
    
    if (deadline < now) return { text: "Deadline telah lewat", isOverdue: true };
    
    const diffTime = deadline - now;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
    
    let remainingText = '';
    
    if (diffDays > 0) {
      remainingText = `${diffDays} hari `;
      if (diffHours > 0) remainingText += `${diffHours} jam `;
      remainingText += 'lagi';
    } else if (diffHours > 0) {
      remainingText = `${diffHours} jam `;
      if (diffMinutes > 0) remainingText += `${diffMinutes} menit `;
      remainingText += 'lagi';
    } else {
      remainingText = `${diffMinutes} menit lagi`;
    }
    
    return { text: remainingText, isOverdue: false };
  };

  const timeRemaining = calculateTimeRemaining();
  const wibDeadline = note.deadline ? adjustToWIB(note.deadline) : null;

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
            {type === 'active' ? 'Tenggat Waktu:' : 'Tenggat Waktu selesai:'}
          </span> {formatDate ? formatDate(wibDeadline) : wibDeadline?.toString()}
        </p>
        
        {timeRemaining && type === 'active' && (
          <p className={`text-sm ${timeRemaining.isOverdue ? 'text-red-400' : 'text-green-400'}`}>
            <span className="font-bold">Sisa Waktu:</span> {timeRemaining.text}
          </p>
        )}
        
        <p className="text-sm mt-1">
          <span className="font-bold">Dibuat pada:</span> {formatDate ? formatDate(note.created_at) : note.created_at}
        </p>
      </div>
      
      <div className={`${contentBg} p-3 rounded-md mb-4 min-h-24 max-h-32 overflow-y-auto`}>
        <p className={`text-[#d5cea3] ${type === 'completed' ? 'opacity-80' : ''}`}>
          {note.description || "Tidak ada deskripsi"}
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
            Selesai
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