import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Pomodoro = () => {
  const navigate = useNavigate();
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [mode, setMode] = useState('pomodoro'); // pomodoro, shortBreak, longBreak
  const [progress, setProgress] = useState(100);
  const [showSettings, setShowSettings] = useState(false);
  
  // Use localStorage to persist user's custom time settings
  const [customTimes, setCustomTimes] = useState(() => {
    const savedTimes = localStorage.getItem('pomodoroTimes');
    return savedTimes ? JSON.parse(savedTimes) : {
      pomodoro: 25,
      shortBreak: 5,
      longBreak: 15
    };
  });
  
  // Initial time in seconds for each mode
  const modes = {
    pomodoro: customTimes.pomodoro * 60,
    shortBreak: customTimes.shortBreak * 60,
    longBreak: customTimes.longBreak * 60
  };
  
  // Current total seconds
  const totalSeconds = minutes * 60 + seconds;
  
  // Maximum seconds for current mode
  const maxSeconds = modes[mode];
  
  // Save custom times to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('pomodoroTimes', JSON.stringify(customTimes));
  }, [customTimes]);
  
  useEffect(() => {
    let interval = null;

    if (isRunning && !isPaused) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            // Timer finished
            clearInterval(interval);
            setIsRunning(false);
            // Play sound
            const audio = new Audio('/notification.mp3'); // Add a notification sound to your public folder
            audio.play().catch(e => console.log('Audio playback error:', e));
            
            // Show notification if browser supports it
            if (Notification.permission === 'granted') {
              new Notification('Pomodoro Timer', {
                body: mode === 'pomodoro' ? 'Time to take a break!' : 'Time to focus!',
                icon: '/pomodoro.svg'
              });
            }
            
            // Switch modes automatically
            if (mode === 'pomodoro') {
              switchMode('shortBreak');
            } else {
              switchMode('pomodoro');
            }
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
        
        // Update progress
        const currentTotalSeconds = (minutes * 60 + seconds - 1 < 0) ? 0 : minutes * 60 + seconds - 1;
        const newProgress = (currentTotalSeconds / maxSeconds) * 100;
        setProgress(newProgress);
        
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isRunning, isPaused, minutes, seconds, mode, maxSeconds]);
  
  // Update time when mode changes
  const switchMode = (newMode) => {
    setMode(newMode);
    setIsRunning(false);
    setIsPaused(false);
    const newMinutes = customTimes[newMode];
    setMinutes(newMinutes);
    setSeconds(0);
    setProgress(100);
  };
  
  const startTimer = () => {
    if (!isRunning) {
      setIsRunning(true);
      setIsPaused(false);
      
      // Request notification permission if not granted
      if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        Notification.requestPermission();
      }
    }
  };
  
  const pauseTimer = () => {
    setIsPaused(true);
  };
  
  const resumeTimer = () => {
    setIsPaused(false);
  };
  
  const resetTimer = () => {
    setIsRunning(false);
    setIsPaused(false);
    const newMinutes = customTimes[mode];
    setMinutes(newMinutes);
    setSeconds(0);
    setProgress(100);
  };
  
  // Handle custom time input changes
  const handleTimeChange = (modeType, value) => {
    // Ensure value is a number between 1 and 60
    const numValue = Math.min(Math.max(parseInt(value) || 1, 1), 60);
    
    setCustomTimes(prev => ({
      ...prev,
      [modeType]: numValue
    }));
    
    // If we're changing the current mode's time, update the timer if not running
    if (modeType === mode && !isRunning) {
      setMinutes(numValue);
      setSeconds(0);
      setProgress(100);
    }
  };
  
  // Format time with leading zeros
  const formatTime = (mins, secs) => {
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Calculate gradient color based on progress - now using light blue shades
  const getGradientColor = () => {
    if (progress > 70) {
      return 'from-blue-300 to-blue-400'; // Light blue when plenty of time
    } else if (progress > 40) {
      return 'from-blue-300 to-blue-400'; // Keep light blue for consistency
    } else if (progress > 20) {
      return 'from-blue-300 to-blue-400'; // Keep light blue for consistency
    } else {
      return 'from-blue-300 to-blue-400'; // Keep light blue for consistency
    }
  };
  
  // Calculate circle circumference
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

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
      {/* Clouds as background - more clouds with different opacity for better effect */}
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
      
      {/* Header container for positioning the home button */}
      <div className="w-full flex justify-end px-4 mb-4 md:mb-6 z-30">
        <motion.button
          onClick={() => navigate('/')}
          className="bg-blue-200 text-blue-500 px-4 py-1 rounded-md flex items-center text-sm font-poppins"
          whileHover={{ scale: 1.05, backgroundColor: "#bfdbfe" }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Home
        </motion.button>
      </div>

      {/* Main content - Container with responsive width */}
      <div className="w-full max-w-md md:max-w-sm px-4 flex flex-col items-center z-10">
        <motion.h1
          className="text-2xl md:text-3xl font-bold text-white mb-4 md:mb-6 font-poppins text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Pomodoro Timer
        </motion.h1>
        
        {/* Settings button */}
        <motion.button
          className="text-white bg-blue-400 hover:bg-blue-500 rounded-full w-8 h-8 flex items-center justify-center mb-4 shadow-md"
          whileHover={{ scale: 1.1, rotate: 15 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowSettings(!showSettings)}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </motion.button>
        
        {/* Settings panel */}
        {showSettings && (
          <motion.div 
            className="w-full bg-white bg-opacity-90 backdrop-filter backdrop-blur-sm rounded-lg shadow-md p-4 mb-6"
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-md font-bold text-blue-400 mb-3 font-poppins">Custom Timer Settings</h3>
            
            <div className="mb-3">
              <label className="flex items-center justify-between text-sm text-blue-500 mb-1 font-poppins">
                <span>Focus Time (min):</span>
                <input 
                  type="number" 
                  min="1"
                  max="60"
                  className="w-16 p-1 bg-blue-50 border border-blue-200 rounded text-center text-blue-600"
                  value={customTimes.pomodoro}
                  onChange={(e) => handleTimeChange('pomodoro', e.target.value)}
                />
              </label>
            </div>
            
            <div className="mb-3">
              <label className="flex items-center justify-between text-sm text-blue-500 mb-1 font-poppins">
                <span>Short Break (min):</span>
                <input 
                  type="number"
                  min="1"
                  max="60"
                  className="w-16 p-1 bg-blue-50 border border-blue-200 rounded text-center text-blue-600"
                  value={customTimes.shortBreak}
                  onChange={(e) => handleTimeChange('shortBreak', e.target.value)}
                />
              </label>
            </div>
            
            <div className="mb-3">
              <label className="flex items-center justify-between text-sm text-blue-500 mb-1 font-poppins">
                <span>Long Break (min):</span>
                <input 
                  type="number"
                  min="1"
                  max="60"
                  className="w-16 p-1 bg-blue-50 border border-blue-200 rounded text-center text-blue-600"
                  value={customTimes.longBreak}
                  onChange={(e) => handleTimeChange('longBreak', e.target.value)}
                />
              </label>
            </div>
          </motion.div>
        )}
        
        {/* Mode selector - Made smaller on mobile */}
        <motion.div 
          className="flex space-x-1 md:space-x-2 mb-6 md:mb-8 w-full"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <motion.button
            className={`flex-1 px-2 md:px-4 py-1 md:py-2 rounded-md font-poppins text-xs md:text-sm ${mode === 'pomodoro' ? 'bg-white text-blue-400 font-bold' : 'bg-blue-400 text-white'}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => switchMode('pomodoro')}
          >
            Pomodoro
          </motion.button>
          <motion.button
            className={`flex-1 px-2 md:px-4 py-1 md:py-2 rounded-md font-poppins text-xs md:text-sm ${mode === 'shortBreak' ? 'bg-white text-blue-400 font-bold' : 'bg-blue-400 text-white'}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => switchMode('shortBreak')}
          >
            Short Break
          </motion.button>
          <motion.button
            className={`flex-1 px-2 md:px-4 py-1 md:py-2 rounded-md font-poppins text-xs md:text-sm ${mode === 'longBreak' ? 'bg-white text-blue-400 font-bold' : 'bg-blue-400 text-white'}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => switchMode('longBreak')}
          >
            Long Break
          </motion.button>
        </motion.div>

        {/* Timer circle with responsive size */}
        <motion.div
          className="relative w-64 h-64 sm:w-72 sm:h-72 md:w-64 md:h-64 flex items-center justify-center mb-6 md:mb-8 p-4 bg-white bg-opacity-90 backdrop-filter backdrop-blur-sm rounded-full shadow-lg"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Background circle */}
            <svg className="w-full h-full" viewBox="0 0 256 256">
              <circle 
                cx="128" 
                cy="128" 
                r={radius} 
                fill="none" 
                stroke="rgba(255, 255, 255, 0.6)" 
                strokeWidth="12"
              />
            </svg>
            
            {/* Progress circle with light blue color */}
            <svg className="absolute top-0 left-0 w-full h-full -rotate-90" viewBox="0 0 256 256">
              <circle 
                cx="128" 
                cy="128" 
                r={radius} 
                fill="none" 
                stroke="#93c5fd" /* Light blue color */
                strokeWidth="12"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                style={{ 
                  transition: 'stroke-dashoffset 1s ease-in-out',
                  filter: 'drop-shadow(0px 0px 6px rgba(147,197,253,0.7))'
                }}
              />
            </svg>
            
            {/* Timer display with responsive font size */}
            <div className="absolute flex flex-col items-center">
              <span className="text-4xl sm:text-5xl md:text-5xl font-bold text-blue-300 font-poppins" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                {formatTime(minutes, seconds)}
              </span>
              <span className="text-sm sm:text-md md:text-lg mt-2 capitalize font-poppins font-medium text-blue-400">
                {mode === 'pomodoro' ? 'Focus Time' : (mode === 'shortBreak' ? 'Short Break' : 'Long Break')}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Controls with responsive sizing */}
        <motion.div 
          className="flex justify-center space-x-3 md:space-x-4 mt-2 md:mt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {!isRunning ? (
            <motion.button
              className="bg-white text-blue-400 px-4 md:px-6 py-1 md:py-2 rounded-md font-bold shadow-md font-poppins text-sm md:text-base"
              whileHover={{ scale: 1.05, backgroundColor: "#f0f9ff" }}
              whileTap={{ scale: 0.95 }}
              onClick={startTimer}
            >
              Start
            </motion.button>
          ) : isPaused ? (
            <motion.button
              className="bg-white text-blue-400 px-4 md:px-6 py-1 md:py-2 rounded-md font-bold shadow-md font-poppins text-sm md:text-base"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={resumeTimer}
            >
              Resume
            </motion.button>
          ) : (
            <motion.button
              className="bg-white text-blue-400 px-4 md:px-6 py-1 md:py-2 rounded-md font-bold shadow-md font-poppins text-sm md:text-base"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={pauseTimer}
            >
              Pause
            </motion.button>
          )}
          
          <motion.button
            className="bg-blue-300 text-white px-4 md:px-6 py-1 md:py-2 rounded-md font-bold shadow-md font-poppins text-sm md:text-base"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetTimer}
          >
            Reset
          </motion.button>
        </motion.div>

        {/* Instructions with responsive width and padding */}
        <motion.div 
          className="mt-8 md:mt-12 w-full px-4 md:px-8 py-3 md:py-4 bg-white bg-opacity-75 backdrop-filter backdrop-blur-sm rounded-lg shadow-md mb-8 md:mb-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          <h3 className="text-md md:text-lg font-bold mb-2 font-poppins text-blue-400">How to use the Pomodoro Technique:</h3>
          <ol className="list-decimal list-inside text-blue-500 space-y-1 font-poppins text-xs md:text-sm">
            <li>Select a task to work on</li>
            <li>Customize timer settings if needed (click ⚙️ icon)</li>
            <li>Work on the task until the timer rings</li>
            <li>Take a short break (5 minutes)</li>
            <li>After four pomodoros, take a longer break (15-30 minutes)</li>
          </ol>
        </motion.div>
      </div>
    </div>
  );
};

export default Pomodoro;