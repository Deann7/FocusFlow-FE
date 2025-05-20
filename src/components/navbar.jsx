import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    navigate('/');
  };
  return (
    <div className="w-full bg-gradient-to-r from-blue-400 to-purple-400 px-4 py-2 flex justify-between items-center border-b-2 border-white/30">
      <div className="flex items-center">
        <motion.div
          className="text-white font-poppins cursor-pointer flex items-center"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/landingPage')}
        >
          <img src="/book.svg" alt="Book" className="w-6 h-6 mr-2" />
          <span className="font-bold text-lg">FocusFlow</span>
        </motion.div>
      </div>
      
      <div className="flex items-center gap-4">
        <motion.div
          className="text-white cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/userProfile')}
        >
          <img src="/profile.svg" alt="User Profile" className="w-6 h-6" />
        </motion.div>
        <motion.button
          className="bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-md border border-white/30 text-sm font-poppins"
          whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.3)' }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
        >
          Logout
        </motion.button>
      </div>
    </div>
  );
};

export default Navbar;
