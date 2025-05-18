import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // Construct the URL with query parameters directly, just like in Postman
      const url = `https://focus-flow-be.vercel.app/user/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`;
      
      console.log('Sending login request to:', url);
      
      // Use axios.post but without any data in the body
      const response = await axios.post(url);
      
      console.log('Login response:', response.data);
      
      if (response.data.success) {
        // Data user ada di response.data.payload, bukan response.data
        const userData = response.data.payload;
        
        console.log('User data received:', userData);
        
        if (!userData || !userData.id) {
          setError('Invalid user data received from server');
          return;
        }
        
        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('isAuthenticated', 'true');
        
        console.log('Authentication successful, redirecting to notes page');
        
        // Small delay to ensure localStorage is updated before redirect
        setTimeout(() => {
          navigate('/notes');
        }, 300);
      } else {
        setError(response.data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      
      // More detailed error logging
      if (err.response) {
        console.error('Error data:', err.response.data);
        console.error('Error status:', err.response.status);
        
        // Display more specific error message based on status code
        if (err.response.status === 400) {
          setError(err.response.data.message || 'Invalid email or password.');
        } else if (err.response.status === 404) {
          setError('User not found. Please check your email.');
        } else {
          setError(err.response.data.message || `Error ${err.response.status}: An error occurred during login`);
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
    <div className="w-full h-screen bg-blue-300 flex flex-col items-center justify-center overflow-hidden relative">
      {/* Home button with animation */}
      <motion.div 
        className="absolute top-4 left-4 z-30"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >        <motion.button
        onClick={() => navigate('/')}
          className="bg-blue-200 text-blue-500 px-4 py-1 rounded-md flex items-center text-sm font-poppins"
          whileHover={{ scale: 1.05, backgroundColor: "#bfdbfe" }}
          whileTap={{ scale: 0.95 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Home
        </motion.button>
      </motion.div>      <motion.div 
        className="absolute top-16 flex items-center justify-center z-20"
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
        </motion.div>        <motion.h1 
          className="text-4xl text-white font-bold font-poppins" 
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        >
          FocusFlow*
        </motion.h1>
      </motion.div>      {/* Animated Clouds - with different directions */}
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
      ))}

      {/* Login Form with animations */}
      <motion.div 
        className="z-20 bg-Yellow_Pixel p-6 rounded-lg w-80 shadow-md mt-20 md:mt-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >        <motion.h2 
          className="text-xl font-extrabold text-Blue_Pixel2 mb-4 text-center font-poppins"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          Login
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
        
        <div>          <div className="mb-3">
            <label className="block text-blue-400 font-bold mb-1 text-sm font-poppins">
              Email
            </label>
            <motion.input 
              whileFocus={{ scale: 1.02, borderColor: "#3b82f6" }}
              type="email" 
              className="w-full p-2 border border-blue-200 rounded focus:outline-none focus:border-blue-400 font-poppins"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
            <div className="mb-4">
            <label className="block text-blue-400 font-bold mb-1 text-sm font-poppins">
              Password
            </label>
            <motion.input 
              whileFocus={{ scale: 1.02, borderColor: "#3b82f6" }}
              type="password" 
              className="w-full p-2 border border-blue-200 rounded focus:outline-none focus:border-blue-400 font-poppins"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
            <motion.button 
            onClick={handleLogin}
            className="w-full bg-Blue_Pixel3 text-white font-bold py-2 px-4 rounded hover:bg-blue-500 transition-colors font-poppins"
            whileHover={{ scale: 1.03, backgroundColor: "#3b82f6" }}
            whileTap={{ scale: 0.97 }}
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Log In'}
          </motion.button>
        </div>
          <motion.div 
          className="mt-4 text-center text-xs font-poppins"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          Don't have an account?{' '}
          <motion.a 
            href="/register" 
            className="text-blue-600 hover:underline font-poppins"
            whileHover={{ scale: 1.1, color: "#2563eb" }}
          >
            Register here
          </motion.a>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;