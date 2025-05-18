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
      boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.15)",
      transition: { 
        scale: { duration: 0.2, type: "spring", stiffness: 300 },
        boxShadow: { duration: 0.2 }
      }
    }
  };

  const adjustToWIB = (dateString) => {
    const date = new Date(dateString);
    date.setHours(date.getHours() - 7);
    return date;
  };

  // Updated card styles to match the new glass-morphism design
  const cardStyles = type === 'active' 
    ? "bg-white/20 backdrop-blur-md border border-white/30" 
    : "bg-sky-900/30 backdrop-blur-md border border-white/20 opacity-90";

  // Updated content background
  const contentBg = type === 'active' 
    ? "bg-white/10 backdrop-blur-sm" 
    : "bg-sky-900/40 backdrop-blur-sm";

  const badgeLabel = type === 'active' 
    ? (isPastDue && isPastDue(note.deadline) ? "OVERDUE" : null) 
    : "COMPLETED";

  // Updated badge colors
  const badgeColor = type === 'active' 
    ? "bg-red-600/80 backdrop-blur-sm text-white" 
    : "bg-emerald-500/80 backdrop-blur-sm text-white";

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
      className={`${cardStyles} rounded-xl p-4 shadow-lg relative overflow-hidden`}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      layoutId={`card-${note.id}`} // Add layout animations when cards are reordered
    >
      {/* Interactive decorative elements */}
      <motion.div 
        className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-blue-400/20 z-0"
        animate={{ 
          scale: [1, 1.2, 1],
        }}
        transition={{ 
          repeat: Infinity,
          repeatType: "reverse",
          duration: 5,
          ease: "easeInOut" 
        }}
      />
      <motion.div 
        className="absolute -bottom-10 -left-10 w-16 h-16 rounded-full bg-purple-400/20 z-0"
        animate={{ 
          scale: [1, 1.1, 1],
        }}
        transition={{ 
          repeat: Infinity,
          repeatType: "reverse",
          duration: 4,
          ease: "easeInOut",
          delay: 0.5
        }}
      />
      
      {badgeLabel && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className={`absolute top-0 right-0 ${badgeColor} text-xs font-medium px-3 py-1 m-2 rounded-full shadow-md`}
        >
          {badgeLabel}
        </motion.div>
      )}
      
      <div className="relative z-10">
        <motion.h3 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl font-bold text-white mb-2 drop-shadow-md group"
        >
          <motion.span className="inline-block" whileHover={{ scale: 1.03 }}>
            {note.title}
          </motion.span>
        </motion.h3>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={`text-white ${type === 'completed' ? 'opacity-80' : 'opacity-90'} mb-3`}
        >
          <p className="text-sm mb-1 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="font-bold">
              {type === 'active' ? 'Tenggat Waktu:' : 'Tenggat Waktu selesai:'}
            </span> {formatDate ? formatDate(wibDeadline) : wibDeadline?.toString()}
          </p>
          
          {timeRemaining && type === 'active' && (
            <p className={`text-sm ${timeRemaining.isOverdue ? 'text-red-300' : 'text-green-300'} flex items-center`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-bold">Sisa Waktu:</span> {timeRemaining.text}
            </p>
          )}
          
          <p className="text-sm mt-1 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-bold">Dibuat pada:</span> {formatDate ? formatDate(note.created_at) : note.created_at}
          </p>
        </motion.div>
          <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`${contentBg} p-4 rounded-lg mb-4 min-h-24 max-h-32 overflow-y-auto shadow-inner relative z-10 group`}
          whileHover={{ boxShadow: "inset 0 2px 10px rgba(0, 0, 0, 0.15)" }}
        >
          {/* Subtle hover effect for content */}
          <motion.div
            initial={false}
            whileHover={{ 
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              transition: { duration: 0.2 }
            }}
            className="p-2 rounded-md transition-colors"
          >
            <p className={`text-white ${type === 'completed' ? 'opacity-80' : ''}`}>
              {note.description || 
                <span className="italic text-white/60 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Tidak ada deskripsi
                </span>
              }
            </p>
          </motion.div>
          
          {/* Scrollbar indicator that appears on hover when content is scrollable */}
          <motion.div 
            className="h-1 bg-white/10 absolute bottom-1 right-2 left-2 rounded-full hidden group-hover:block"
            initial={false}
            animate={{ opacity: 0.6 }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>
        
        <div className="flex justify-end relative z-10">
          {type === 'active' ? (
            <motion.button
              className="bg-blue-600/80 text-white py-2 px-5 rounded-full shadow-md hover:bg-blue-700/80 transition-colors duration-200 flex items-center"
              whileHover={{ scale: 1.05, boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.2)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onComplete && onComplete(note.id)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Selesai
            </motion.button>
          ) : (
            <motion.button
              className="bg-red-500/80 text-white py-2 px-4 rounded-full shadow-md hover:bg-red-600/80 transition-colors duration-200 flex items-center"
              whileHover={{ scale: 1.05, boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.2)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                console.log('Delete button clicked for note ID:', note.id);
                if (onDelete) {
                  onDelete(note.id);
                } else {
                  console.error('onDelete function not provided');
                }
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Hapus
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Cards;