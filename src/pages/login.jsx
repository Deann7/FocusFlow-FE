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
      const url = `https://backend-tutam-sbd9-dean.vercel.app/user/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`;
      
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

  // Cloud animation
  const [cloudPositions] = useState([
    { left: '5%', top: '15%', delay: 0 },
    { left: '25%', top: '10%', delay: 0.5 },
    { left: '70%', top: '20%', delay: 1 },
  ]);

  return (
    <div className="w-full h-screen bg-amber-600 flex flex-col items-center justify-center overflow-hidden relative">
      {/* Back to Home button */}
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

      {/* Clouds with Framer Motion */}
      {cloudPositions.map((cloud, index) => (
        <motion.div 
          key={index}
          className="absolute z-10"
          initial={{ x: -100, opacity: 0 }}
          animate={{ 
            x: 0, 
            opacity: 1,
            left: cloud.left,
            top: cloud.top,
          }}
          transition={{ 
            delay: cloud.delay,
            duration: 1.5
          }}
        >
          <div className="w-32 h-16 relative">
            <div className="absolute bg-amber-100 w-12 h-6 top-4 left-0"></div>
            <div className="absolute bg-amber-100 w-16 h-10 top-0 left-8"></div>
            <div className="absolute bg-amber-100 w-12 h-6 top-4 left-20"></div>
          </div>
        </motion.div>
      ))}

      {/* Login Form */}
      <motion.div 
        className="z-20 bg-amber-200 border-4 border-amber-900 p-8 rounded-lg w-96 shadow-xl"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <motion.h2 
          className="text-3xl font-bold text-amber-900 mb-6 text-center"
          style={{ fontFamily: 'monospace' }}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          LOGIN
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
        
        <form onSubmit={handleLogin}>
          <div className="mb-4">
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
          </div>
          
          <div className="mb-6">
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
          </div>
          
          <motion.button 
            type="submit"
            className="w-full bg-amber-500 text-amber-900 font-bold py-2 px-4 rounded border-2 border-amber-900 hover:bg-amber-400 transition-colors duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isLoading}
            style={{ fontFamily: 'monospace' }}
          >
            {isLoading ? 'LOGGING IN...' : 'LOG IN'}
          </motion.button>
        </form>
        
        <motion.div 
          className="mt-4 text-center text-amber-900"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          style={{ fontFamily: 'monospace' }}
        >
          Don't have an account?{' '}
          <Link to="/register" className="text-amber-800 underline hover:text-amber-700">
            Register here
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;