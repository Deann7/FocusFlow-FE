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
      const url = `https://focus-flow-be.vercel.app/user/register?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`;
      
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

  const Cloud = () => (
    <img src="/cloud.svg" alt="Cloud" />
  );

  const Book = () => (
    <img src="/book.svg" alt="Book" />
  );

  const cloudPositions = [
    { top: '15%', delay: 0, direction: 'right-to-left' },
    { top: '35%', delay: 2, direction: 'left-to-right' },
    { top: '60%', delay: 1, direction: 'right-to-left' },
    { top: '80%', delay: 3, direction: 'left-to-right' }
  ];
  return (
    <div className="w-full min-h-screen h-full bg-blue-300 flex flex-col items-center justify-start pt-16 overflow-y-auto relative">      {/* Home button with animation */}      <motion.div 
        className="absolute top-4 right-4 z-30"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >        <motion.button
          onClick={() => navigate('/')}
          className="bg-blue-400/30 backdrop-blur-sm text-white px-5 py-2 rounded-full flex items-center text-sm font-poppins border border-white/20"
          whileHover={{ 
            scale: 1.08, 
            backgroundColor: "rgba(96, 165, 250, 0.5)",
            boxShadow: "0 0 15px rgba(255, 255, 255, 0.5)"
          }}
          whileTap={{ scale: 0.92 }}
          initial={{ boxShadow: "0 0 0px rgba(255, 255, 255, 0)" }}
          animate={{ 
            boxShadow: ["0 0 0px rgba(255, 255, 255, 0)", "0 0 10px rgba(255, 255, 255, 0.3)", "0 0 0px rgba(255, 255, 255, 0)"],
          }}
          transition={{ 
            boxShadow: { 
              repeat: Infinity, 
              duration: 2,
            }
          }}
        >
          <motion.div 
            className="mr-2"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </motion.div>
          <span>Home</span>
        </motion.button></motion.div>
        <motion.div 
        className="flex items-center justify-center z-20 mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <motion.div 
          className="w-16 h-16 max-md:w-10 max-md:h-10 border-none bg-blue-300 flex items-center justify-center mr-2"
          animate={{ rotate: [0, 0, 5, -5, 0] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
        >
          <Book />
        </motion.div>       
         <motion.h1 
          className="text-4xl text-white font-bold font-poppins" 
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        >
          FocusFlow*
        </motion.h1>
      </motion.div>
      {cloudPositions.map((cloud, index) => (
        <motion.div
          key={index}
          className="absolute z-10"
          initial={cloud.direction === 'right-to-left' ? { right: -150 } : { left: -150 }}
          animate={cloud.direction === 'right-to-left' ? { right: '100%' } : { left: '100%' }}
          transition={{
            repeat: Infinity,
            duration: 20 + index * 4,
            delay: cloud.delay,
            ease: "linear"
          }}
          style={{ top: cloud.top }}
        >
          <Cloud />
        </motion.div>
      ))}        {/* Registration Form with animations */}
      <motion.div 
        className="z-20 bg-Yellow_Pixel p-6 rounded-lg w-96 shadow-md mt-0"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >        <motion.h2 
          className="text-xl font-extrabold text-Blue_Pixel2 mb-4 text-center font-poppins"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          Register
        </motion.h2>
          {error && (
          <motion.div 
            className="bg-red-100 text-red-600 p-2 mb-4 rounded text-sm font-poppins"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
          >
            {error}
          </motion.div>
        )}
        
        <form onSubmit={handleRegister}>          <div className="mb-3">
            <label className="block text-blue-400 font-bold mb-1 text-sm font-poppins">
              Name
            </label>
            <motion.input 
              whileFocus={{ scale: 1.02, borderColor: "#3b82f6" }}
              type="text" 
              className="w-full p-2 border border-blue-200 rounded focus:outline-none focus:border-blue-400 font-poppins"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
            <div className="mb-3">
            <label className="block text-blue-400 font-bold mb-1 text-sm font-poppins">
              Email
            </label>
            <motion.input 
              whileFocus={{ scale: 1.02, borderColor: "#3b82f6" }}
              type="email" 
              className="w-full p-2 border border-blue-200 rounded focus:outline-none focus:border-blue-400 font-poppins"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
            <div className="mb-3">
            <label className="block text-blue-400 font-bold mb-1 text-sm font-poppins">
              Password
            </label>
            <motion.input 
              whileFocus={{ scale: 1.02, borderColor: "#3b82f6" }}
              type="password" 
              className="w-full p-2 border border-blue-200 rounded focus:outline-none focus:border-blue-400 font-poppins"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
            <div className="mb-4">
            <label className="block text-blue-400 font-bold mb-1 text-sm font-poppins">
              Confirm Password
            </label>
            <motion.input 
              whileFocus={{ scale: 1.02, borderColor: "#3b82f6" }}
              type="password" 
              className="w-full p-2 border border-blue-200 rounded focus:outline-none focus:border-blue-400 font-poppins"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
            <motion.button 
            type="submit"
            className="w-full bg-Blue_Pixel3 text-white font-bold py-2 px-4 rounded hover:bg-blue-500 transition-colors font-poppins"
            whileHover={{ scale: 1.03, backgroundColor: "#3b82f6" }}
            whileTap={{ scale: 0.97 }}
            disabled={isLoading}
          >
            {isLoading ? 'Registering...' : 'Register'}
          </motion.button>
        </form>
          <motion.div 
          className="mt-4 text-center text-xs font-poppins"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          Already have an account?{' '}
          <motion.a 
            href="/login" 
            className="text-blue-600 hover:underline font-poppins"
            whileHover={{ scale: 1.1, color: "#2563eb" }}
          >
            Login here
          </motion.a>
        </motion.div>
      </motion.div>
      <div className='pb-10'></div>
    </div>
  );
};

export default Register;