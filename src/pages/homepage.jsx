import React from 'react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Homepage = () => {
    const navigate = useNavigate();
    const [hover, setHover] = useState(false);
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const [cloudPositions, setCloudPositions] = useState([
      { left: '10%', speed: 0.2 },
      { left: '30%', speed: 0.15 },
      { left: '60%', speed: 0.25 },
      { left: '85%', speed: 0.18 }
    ]);
    
    useEffect(() => {
      const interval = setInterval(() => {
        setCloudPositions(prev => prev.map(cloud => {
          let newLeft = parseFloat(cloud.left) + cloud.speed;
          if (newLeft > 110) newLeft = -20;
          return { ...cloud, left: `${newLeft}%` };
        }));
      }, 100);
      
      return () => clearInterval(interval);
    }, []);
  
    const [shake, setShake] = useState(false);
    const handleClick = () => {
      setShake(true);
      setTimeout(() => {
        setShake(false);
        if (isAuthenticated) {
          navigate('/notes');
        } else {
          navigate('/login');
        }
      }, 500);
    };

    const handleLogout = () => {
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
      setUser(null);
      setIsAuthenticated(false);
    };

    useEffect(() => {
      const authStatus = localStorage.getItem('isAuthenticated') === 'true';
      setIsAuthenticated(authStatus);
      
      if (authStatus) {
        try {
          const userData = JSON.parse(localStorage.getItem('user'));
          setUser(userData);
        } catch (e) {
          console.error('Error parsing user data:', e);
        }
      }
    }, []);
  
    return (
      <motion.div 
        className="w-full h-screen bg-amber-600 flex flex-col items-center justify-center overflow-hidden relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Clouds */}
        {cloudPositions.map((cloud, index) => (
          <motion.div 
            key={index}
            className="absolute z-10"
            style={{ 
              left: cloud.left,
              top: ['15%', '10%', '20%', '5%'][index % 4]
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.2, duration: 1 }}
          >
            <div className="w-32 h-16 relative">
              <div className="absolute bg-amber-100 w-12 h-6 top-4 left-0"></div>
              <div className="absolute bg-amber-100 w-16 h-10 top-0 left-8"></div>
              <div className="absolute bg-amber-100 w-12 h-6 top-4 left-20"></div>
            </div>
          </motion.div>
        ))}

        {/* User greeting if logged in */}
        {isAuthenticated && user && (
          <motion.div 
            className="absolute top-6 right-6 z-30 bg-amber-800 px-4 py-2 rounded-lg border-2 border-amber-900"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-amber-200 font-bold mr-4" style={{ fontFamily: 'monospace' }}>
                HALO, {user.name?.toUpperCase()}
              </h2>
              <motion.button
                className="bg-amber-600 text-amber-200 px-3 py-1 rounded border border-amber-900 text-sm"
                whileHover={{ scale: 1.05, backgroundColor: '#d97706' }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                style={{ fontFamily: 'monospace' }}
              >
                LOGOUT
              </motion.button>
            </div>
          </motion.div>
        )}
  
        {/* Title */}
        <motion.div 
          className="z-20 mb-2 mt-8 text-center font-black"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h1 className="text-6xl font-bold text-amber-400 tracking-wide"
              style={{ 
                fontFamily: 'monospace',
                WebkitTextStroke: '3px #5c3000',
                textShadow: '4px 4px 0 #5c3000'
              }}>
            CRUMBLE
          </h1>
          <h1 className="text-6xl font-bold text-amber-400 tracking-wide"
              style={{ 
                fontFamily: 'monospace',
                WebkitTextStroke: '3px #5c3000',
                textShadow: '4px 4px 0 #5c3000'
              }}>
            NOTES
          </h1>
        </motion.div>
  
        {/* Main Button */}
        <motion.div 
          className={`z-20 mt-8 relative ${shake ? 'animate-bounce' : ''}`}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onClick={handleClick}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <motion.div 
            className="bg-amber-300 border-4 border-amber-900 px-8 py-4 cursor-pointer"
            whileHover={{ scale: 1.05, boxShadow: '0px 5px 15px rgba(0,0,0,0.2)' }}
            whileTap={{ scale: 0.95 }}
          >
            <p className="text-amber-900 text-2xl font-bold text-center"
              style={{ fontFamily: 'monospace' }}>
              {isAuthenticated ? (
                <>GO TO MY NOTES</>
              ) : (
                <>LET'S START BREAKING<br/>DEADLINES</>
              )}
            </p>
          </motion.div>
        </motion.div>

        {/* Authentication Buttons - only show if not authenticated */}
        {!isAuthenticated && (
          <motion.div 
            className="z-20 mt-6 flex space-x-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <motion.button
              className="bg-amber-700 text-amber-200 px-6 py-2 rounded border-2 border-amber-900 font-bold"
              style={{ fontFamily: 'monospace' }}
              whileHover={{ scale: 1.05, backgroundColor: '#92400e' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/login')}
            >
              LOGIN
            </motion.button>
            <motion.button
              className="bg-amber-500 text-amber-900 px-6 py-2 rounded border-2 border-amber-900 font-bold"
              style={{ fontFamily: 'monospace' }}
              whileHover={{ scale: 1.05, backgroundColor: '#f59e0b' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/register')}
            >
              REGISTER
            </motion.button>
          </motion.div>
        )}
  
      </motion.div>
    );
}

export default Homepage