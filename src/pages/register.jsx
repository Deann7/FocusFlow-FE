import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const url = `https://backend-tutam-sbd9-dean.vercel.app/user/register?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`;
      
      console.log('Sending registration request to:', url);
      const response = await axios.post(url);
      
      console.log('Registration response:', response.data);
      
      if (response.data.success) {
        navigate('/login');
      } else {
        setError(response.data.message || 'Registration failed');
      }
    } catch (err) {
      console.error('Registration error:', err);
      
      // More detailed error logging
      if (err.response) {
        console.error('Error data:', err.response.data);
        console.error('Error status:', err.response.status);
        
        // Display more specific error message based on status code
        if (err.response.status === 400) {
          setError(err.response.data.message || 'Invalid request. Please check your information.');
        } else {
          setError(err.response.data.message || `Error ${err.response.status}: An error occurred during registration`);
        }
      } else if (err.request) {
        console.error('No response received:', err.request);
        setError('Server did not respond. Please try again later.');
      } else {
        console.error('Error message:', err.message);
        setError('An error occurred while setting up the request.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8,
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  const floatingNotes = [
    { top: '15%', left: '10%', rotation: -15, delay: 0.2 },
    { top: '20%', right: '15%', rotation: 12, delay: 0.5 },
    { top: '70%', left: '15%', rotation: 8, delay: 0.8 },
    { top: '65%', right: '10%', rotation: -10, delay: 1.1 },
  ];

  return (
    <div className="w-full h-screen bg-amber-600 flex flex-col items-center justify-center overflow-hidden relative">
      <motion.div 
        className="absolute top-6 left-6 z-30"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <motion.button
          onClick={() => navigate('/')}
          className="bg-amber-800 text-amber-200 px-4 py-2 rounded-md border-2 border-amber-900 flex items-center font-bold"
          whileHover={{ scale: 1.05, backgroundColor: '#92400e' }}
          whileTap={{ scale: 0.95 }}
          style={{ fontFamily: 'monospace' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          HOME
        </motion.button>
      </motion.div>
      {floatingNotes.map((note, index) => (
        <motion.div 
          key={index}
          className="absolute z-10"
          style={{
            top: note.top,
            left: note.left,
            right: note.right,
          }}
          initial={{ opacity: 0, y: -20, rotate: note.rotation }}
          animate={{ 
            opacity: 1,
            y: [0, -10, 0, 10, 0],
            rotate: note.rotation
          }}
          transition={{ 
            delay: note.delay,
            y: {
              repeat: Infinity,
              duration: 3 + index,
              ease: "easeInOut"
            },
            opacity: { duration: 1 }
          }}
        >
          <div className="w-16 h-20 bg-amber-200 border-2 border-amber-900 shadow-md transform"
               style={{ 
                 boxShadow: '2px 2px 0 rgba(120, 53, 15, 0.5)',
               }}
          >
            <div className="border-b border-amber-900 h-3"></div>
            <div className="flex justify-center items-center h-full">
              <div className="w-10 h-1 bg-amber-900"></div>
            </div>
          </div>
        </motion.div>
      ))}
      <motion.div 
        className="z-20 bg-amber-200 border-4 border-amber-900 p-8 rounded-lg w-96 shadow-xl"
        initial="hidden"
        animate="visible"
        variants={formVariants}
      >
        <motion.h2 
          variants={itemVariants}
          className="text-3xl font-bold text-amber-900 mb-6 text-center"
          style={{ fontFamily: 'monospace' }}
        >
          REGISTER
        </motion.h2>
        
        {error && (
          <motion.div 
            className="bg-red-200 text-red-800 p-2 mb-4 rounded border border-red-400"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error}
          </motion.div>
        )}
        
        <form onSubmit={handleRegister}>
          <motion.div className="mb-4" variants={itemVariants}>
            <label className="block text-amber-900 mb-1 font-medium" style={{ fontFamily: 'monospace' }}>
              Name
            </label>
            <motion.input 
              whileFocus={{ scale: 1.02 }}
              type="text" 
              className="w-full p-2 border-2 border-amber-900 bg-amber-50 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </motion.div>
          
          <motion.div className="mb-4" variants={itemVariants}>
            <label className="block text-amber-900 mb-1 font-medium" style={{ fontFamily: 'monospace' }}>
              Email
            </label>
            <motion.input 
              whileFocus={{ scale: 1.02 }}
              type="email" 
              className="w-full p-2 border-2 border-amber-900 bg-amber-50 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </motion.div>
          
          <motion.div className="mb-4" variants={itemVariants}>
            <label className="block text-amber-900 mb-1 font-medium" style={{ fontFamily: 'monospace' }}>
              Password
            </label>
            <motion.input 
              whileFocus={{ scale: 1.02 }}
              type="password" 
              className="w-full p-2 border-2 border-amber-900 bg-amber-50 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </motion.div>
          
          <motion.div className="mb-6" variants={itemVariants}>
            <label className="block text-amber-900 mb-1 font-medium" style={{ fontFamily: 'monospace' }}>
              Confirm Password
            </label>
            <motion.input 
              whileFocus={{ scale: 1.02 }}
              type="password" 
              className="w-full p-2 border-2 border-amber-900 bg-amber-50 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </motion.div>
          
          <motion.button 
            type="submit"
            className="w-full bg-amber-500 text-amber-900 font-bold py-2 px-4 rounded border-2 border-amber-900 hover:bg-amber-400 transition-colors duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isLoading}
            style={{ fontFamily: 'monospace' }}
            variants={itemVariants}
          >
            {isLoading ? 'REGISTERING...' : 'REGISTER'}
          </motion.button>
        </form>
        
        <motion.div 
          className="mt-4 text-center text-amber-900"
          style={{ fontFamily: 'monospace' }}
          variants={itemVariants}
        >
          Already have an account?{' '}
          <Link to="/login" className="text-amber-800 underline hover:text-amber-700">
            Login here
          </Link>
        </motion.div>
      </motion.div>
      
    </div>
  );
};

export default Register;