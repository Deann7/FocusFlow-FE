import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import StreakDisplay from '../components/StreakDisplay';

const Pomodoro = () => {
  const navigate = useNavigate();
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [mode, setMode] = useState('pomodoro'); // pomodoro, shortBreak, longBreak
  const [progress, setProgress] = useState(100);
  const [showSettings, setShowSettings] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  
  // State untuk koneksi backend
  const [userId, setUserId] = useState(null);
  const [syncError, setSyncError] = useState('');
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: 'success'
  });
  
  // URL API backend - gunakan localhost:4015
  const apiUrl = 'http://focus-flow-be.vercel.app';
  
  // Task-related states
  const [currentTask, setCurrentTask] = useState(() => {
    const savedTask = localStorage.getItem('pomodoroCurrentTask');
    return savedTask || '';
  });
  const [taskInput, setTaskInput] = useState('');
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('pomodoroTasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  
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

  // Function to show notification
  const showNotification = (message, type = 'success', duration = 5000) => {
    setNotification({
      show: true,
      message,
      type
    });

    setTimeout(() => {
      setNotification({
        show: false,
        message: '',
        type: 'success'
      });
    }, duration);
  };

  // Get user ID from localStorage
  const getUserId = () => {
    try {
      const userData = localStorage.getItem('user');
      if (!userData) {
        return null;
      }
      
      const user = JSON.parse(userData);
      if (!user || !user.id) {
        return null;
      }
      
      return user.id;
    } catch (error) {
      console.error("Error getting user ID:", error);
      return null;
    }
  };
  
  // Load user ID from localStorage
  useEffect(() => {
    const id = getUserId();
    if (id) {
      setUserId(id);
      console.log("User ID loaded:", id);
    } else {
      console.log("No user ID found in localStorage");
    }
  }, []);
  
  // Load settings from backend when userId is available
  useEffect(() => {
    if (!userId) {
      console.log("No user ID, skipping settings fetch");
      return;
    }
    
    const fetchSettings = async () => {
      setLoading(true);
      try {
        console.log("Fetching settings for user:", userId);
        const response = await axios.get(`${apiUrl}/pomodoro/settings/user/${userId}`);
        
        if (response.data.success) {
          const settings = response.data.payload;
          // Transform data from backend format to frontend format
          const transformedSettings = {
            pomodoro: settings.pomodoro_time,
            shortBreak: settings.short_break_time,
            longBreak: settings.long_break_time
          };
          
          setCustomTimes(transformedSettings);
          
          // Update timer if not running
          if (!isRunning) {
            setMinutes(transformedSettings[mode]);
            setSeconds(0);
            setProgress(100);
          }
          
          console.log("Settings loaded successfully:", transformedSettings);
          showNotification("Pengaturan timer berhasil dimuat", "success");
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
        setSyncError("Gagal memuat pengaturan timer");
        showNotification("Gagal memuat pengaturan timer", "error");
      } finally {
        setLoading(false);
      }
    };
    
    fetchSettings();
  }, [userId]);
  
  // Load tasks from backend when userId is available
  useEffect(() => {
    if (!userId) {
      console.log("No user ID, skipping tasks fetch");
      return;
    }
    
    const fetchTasks = async () => {
      setLoading(true);
      try {
        console.log("Fetching tasks for user:", userId);
        const response = await axios.get(`${apiUrl}/pomodoro/tasks/user/${userId}`);
        
        if (response.data.success) {
          setTasks(response.data.payload);
          
          // Find current task if any
          const currentTask = response.data.payload.find(task => task.current);
          if (currentTask) {
            setCurrentTask(currentTask.text);
          }
          
          console.log("Tasks loaded successfully:", response.data.payload.length);
          showNotification("Daftar tugas berhasil dimuat", "success");
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setSyncError("Gagal memuat daftar tugas");
        showNotification("Gagal memuat daftar tugas", "error");
      } finally {
        setLoading(false);
      }
    };
    
    fetchTasks();
  }, [userId]);
  
  // Save custom times to backend whenever they change
  useEffect(() => {
    // Still save to localStorage for non-logged in users
    localStorage.setItem('pomodoroTimes', JSON.stringify(customTimes));
    
    // Save to backend if user is logged in
    if (userId && customTimes) {
      const saveSettings = async () => {
        setLoading(true);
        try {
          console.log("Checking for existing settings for user:", userId);
          // First check if user has settings
          const settingsResponse = await axios.get(`${apiUrl}/pomodoro/settings/user/${userId}`);
          
          if (settingsResponse.data.success && settingsResponse.data.payload) {
            const settingsData = settingsResponse.data.payload;
            console.log("Found existing settings:", settingsData);
            
            // Update existing settings
            console.log("Updating settings with ID:", settingsData.id);
            await axios.put(`${apiUrl}/pomodoro/settings/${settingsData.id}`, {
              pomodoro_time: customTimes.pomodoro,
              short_break_time: customTimes.shortBreak,
              long_break_time: customTimes.longBreak
            });
            console.log("Settings updated successfully");
            showNotification("Pengaturan timer berhasil disimpan", "success");
          } else {
            // Create new settings
            console.log("No existing settings found, creating new settings");
            await axios.post(`${apiUrl}/pomodoro/settings`, {
              user_id: userId,
              pomodoro_time: customTimes.pomodoro,
              short_break_time: customTimes.shortBreak,
              long_break_time: customTimes.longBreak
            });
            console.log("Settings created successfully");
            showNotification("Pengaturan timer berhasil dibuat", "success");
          }
          
          setSyncError('');
        } catch (error) {
          console.error("Error saving settings:", error);
          if (error.response) {
            console.error("Response status:", error.response.status);
            console.error("Response data:", error.response.data);
          }
          setSyncError("Gagal menyimpan pengaturan");
          showNotification("Gagal menyimpan pengaturan timer", "error");
        } finally {
          setLoading(false);
        }
      };
      
      saveSettings();
    }
  }, [customTimes, userId]);
  
  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('pomodoroTasks', JSON.stringify(tasks));
  }, [tasks]);
  
  // Save current task to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('pomodoroCurrentTask', currentTask);
  }, [currentTask]);
  
  // Timer functionality
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
            const audio = new Audio('/notification.mp3');
            audio.play().catch(e => console.log('Audio playback error:', e));
            
            // Show notification if browser supports it
            if (Notification.permission === 'granted') {
              new Notification('Pomodoro Timer', {
                body: mode === 'pomodoro' ? 'Time to take a break!' : 'Time to focus!',
                icon: '/pomodoro.svg'
              });
            }
            
            // Complete session in backend if user is logged in
            if (userId && currentSessionId) {
              try {
                console.log("Completing session:", currentSessionId);
                
                // Complete the session in backend
                axios.put(`${apiUrl}/pomodoro/sessions/${currentSessionId}/complete`)
                  .then(response => {
                    console.log("Session completed successfully:", response.data);
                    showNotification("Sesi berhasil diselesaikan!", "success");
                  })
                  .catch(error => {
                    console.error("Error completing session:", error);
                    showNotification("Gagal menyelesaikan sesi", "error");
                  });
              } catch (error) {
                console.error("Error completing session:", error);
              }
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
  }, [isRunning, isPaused, minutes, seconds, mode, maxSeconds, userId, currentSessionId]);
  
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
  
  // Start the timer and create a session in the backend
  const startTimer = async () => {
    if (!isRunning) {
      setIsRunning(true);
      setIsPaused(false);
      
      // Record session start in backend if user is logged in
      if (userId) {
        setLoading(true);
        try {
          // Find task ID if current task is set
          let taskId = null;
          if (currentTask) {
            const currentTaskObj = tasks.find(task => task.text === currentTask);
            if (currentTaskObj) {
              taskId = currentTaskObj.id;
            }
          }
          
          const sessionData = {
            user_id: userId,
            mode,
            duration_seconds: customTimes[mode] * 60,
            task_id: taskId
          };
          
          console.log("Creating new session:", sessionData);
          
          // Create a new session in the backend
          const response = await axios.post(`${apiUrl}/pomodoro/sessions`, sessionData);
          
          if (response.data.success) {
            setCurrentSessionId(response.data.payload.id);
            console.log("Session created with ID:", response.data.payload.id);
            showNotification("Sesi timer dimulai!", "success");
          }
        } catch (error) {
          console.error("Error creating session:", error);
          showNotification("Gagal membuat sesi timer", "error");
        } finally {
          setLoading(false);
        }
      }
      
      // Request notification permission if not granted
      if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        Notification.requestPermission();
      }
    }
  };
  
  const pauseTimer = () => {
    setIsPaused(true);
    showNotification("Timer dijeda", "info");
  };
  
  const resumeTimer = () => {
    setIsPaused(false);
    showNotification("Timer dilanjutkan", "info");
  };
  
  const resetTimer = () => {
    setIsRunning(false);
    setIsPaused(false);
    const newMinutes = customTimes[mode];
    setMinutes(newMinutes);
    setSeconds(0);
    setProgress(100);
    showNotification("Timer direset", "info");
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
  
  // Add a new task
  const addTask = async (e) => {
    e.preventDefault();
    if (taskInput.trim() === '') return;
    
    if (!userId) {
      // For non-logged in users, just use localStorage
      const newTask = {
        id: Date.now(),
        text: taskInput,
        completed: false
      };
      
      setTasks([...tasks, newTask]);
      setTaskInput('');
      setShowAddTask(false);
      showNotification("Tugas berhasil ditambahkan", "success");
      return;
    }
    
    // For logged in users, save to backend
    setLoading(true);
    try {
      const taskData = {
        user_id: userId,
        text: taskInput,
        completed: false,
        current: false
      };
      
      console.log("Creating new task:", taskData);
      
      const response = await axios.post(`${apiUrl}/pomodoro/tasks`, taskData);
      
      if (response.data.success) {
        console.log("Task created:", response.data.payload);
        setTasks([...tasks, response.data.payload]);
        setTaskInput('');
        setShowAddTask(false);
        setSyncError('');
        showNotification("Tugas berhasil ditambahkan", "success");
      }
    } catch (error) {
      console.error("Error creating task:", error);
      setSyncError("Gagal menambahkan tugas");
      showNotification("Gagal menambahkan tugas", "error");
    } finally {
      setLoading(false);
    }
  };
  
  // Set current task
  const setTask = async (taskText, taskId) => {
    setCurrentTask(taskText);
    
    if (!userId || !taskId) {
      console.log("No user ID or task ID, skipping backend update");
      return;
    }
    
    setLoading(true);
    try {
      console.log("Setting current task:", taskId);
      
      // Update task as current in backend
      await axios.put(`${apiUrl}/pomodoro/tasks/${taskId}/set-current`, {
        user_id: userId
      });
      
      // Update local state to reflect change
      setTasks(tasks.map(t => 
        t.id === taskId ? { ...t, current: true } : { ...t, current: false }
      ));
      
      setSyncError('');
      showNotification(`Sedang mengerjakan: ${taskText}`, "success");
    } catch (error) {
      console.error("Error setting current task:", error);
      setSyncError("Gagal mengatur tugas saat ini");
      showNotification("Gagal mengatur tugas saat ini", "error");
    } finally {
      setLoading(false);
    }
  };
  
  // Toggle task completion
  const toggleTaskCompletion = async (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    const newCompletedValue = !task.completed;
    
    // Update local state first for better UX
    const updatedTasks = tasks.map(t => 
      t.id === taskId ? { ...t, completed: newCompletedValue } : t
    );
    setTasks(updatedTasks);
    
    // If this was the current task and it's now completed, clear current task
    if (task.text === currentTask && newCompletedValue) {
      setCurrentTask('');
    }
    
    if (!userId) return;
    
    setLoading(true);
    try {
      console.log("Updating task completion:", taskId, newCompletedValue);
      
      await axios.put(`${apiUrl}/pomodoro/tasks/${taskId}`, {
        completed: newCompletedValue
      });
      
      if (task.current && newCompletedValue) {
        // If this was the current task and now it's completed, update that too
        await axios.put(`${apiUrl}/pomodoro/tasks/${taskId}`, {
          current: false
        });
      }
      
      setSyncError('');
      showNotification(newCompletedValue ? "Tugas ditandai selesai" : "Tugas ditandai belum selesai", "success");
    } catch (error) {
      console.error("Error toggling task completion:", error);
      setSyncError("Gagal memperbarui status tugas");
      showNotification("Gagal memperbarui status tugas", "error");
      
      // Revert the local state change in case of error
      setTasks(tasks);
    } finally {
      setLoading(false);
    }
  };
  
  // Delete a task
  const deleteTask = async (taskId) => {
    const taskToDelete = tasks.find(task => task.id === taskId);
    if (taskToDelete && taskToDelete.text === currentTask) {
      setCurrentTask('');
    }
    
    // Update local state first for better UX
    setTasks(tasks.filter(task => task.id !== taskId));
    
    if (!userId) return;
    
    setLoading(true);
    try {
      console.log("Deleting task:", taskId);
      
      await axios.delete(`${apiUrl}/pomodoro/tasks/${taskId}`);
      setSyncError('');
      showNotification("Tugas berhasil dihapus", "success");
    } catch (error) {
      console.error("Error deleting task:", error);
      setSyncError("Gagal menghapus tugas");
      showNotification("Gagal menghapus tugas", "error");
      
      // Refresh tasks from backend if delete failed
      try {
        const response = await axios.get(`${apiUrl}/pomodoro/tasks/user/${userId}`);
        if (response.data.success) {
          setTasks(response.data.payload);
        }
      } catch (refreshError) {
        console.error("Error refreshing tasks:", refreshError);
      }
    } finally {
      setLoading(false);
    }
  };

  // Render the Cloud component for the background animation
  const Cloud = () => (
    <img src="/cloud.svg" alt="Cloud" className="opacity-80" />
  );

  // Define cloud positions for the animated background
  const cloudPositions = [
    { top: '10%', delay: 0, direction: 'right-to-left', opacity: 0.7 },
    { top: '30%', delay: 2, direction: 'left-to-right', opacity: 0.5 },
    { top: '50%', delay: 1, direction: 'right-to-left', opacity: 0.6 },
    { top: '70%', delay: 3, direction: 'left-to-right', opacity: 0.4 },
    { top: '90%', delay: 2, direction: 'right-to-left', opacity: 0.7 },
  ];
  
  // Calculate gradient color based on progress
  const getGradientColor = () => {
    return 'from-blue-300 to-blue-400'; // Light blue color
  };
  
  // Calculate circle circumference
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="w-full min-h-screen bg-blue-300 flex flex-col items-center justify-start pt-5 md:pt-10 overflow-y-auto relative">
      {/* Animated Clouds */}
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
      
      {/* Notification popup */}
      {notification.show && (
        <motion.div 
          className={`fixed top-4 right-4 z-50 py-4 px-6 rounded-xl shadow-xl backdrop-blur-md 
            ${notification.type === 'success' ? 'bg-green-500/30 border border-green-400/30' : 
              notification.type === 'error' ? 'bg-red-500/30 border border-red-400/30' : 
              'bg-blue-500/30 border border-blue-400/30'
            } text-white max-w-sm`}
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          transition={{ type: "spring", damping: 20 }}
        >
          <div className="flex items-start">
            <div className={`p-2 rounded-full mr-3 flex-shrink-0
              ${notification.type === 'success' ? 'bg-green-500/30' : 
                notification.type === 'error' ? 'bg-red-500/30' : 
                'bg-blue-500/30'}`}
            >
              {notification.type === 'success' && (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              )}
              {notification.type === 'error' && (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              )}
              {notification.type !== 'success' && notification.type !== 'error' && (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              )}
            </div>
            <div>
              <h4 className="font-medium mb-1">
                {notification.type === 'success' ? 'Berhasil!' : 
                notification.type === 'error' ? 'Gagal!' : 'Informasi'}
              </h4>
              <p className="text-white/90 text-sm">{notification.message}</p>
            </div>
          </div>
          <motion.div 
            className="h-1 bg-white/30 absolute bottom-0 left-0 rounded-full"
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: 5 }}
          />
        </motion.div>
      )}
      
      {/* Header container untuk tombol home */}
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

      {/* Konten utama */}
      <div className="w-full max-w-md px-4 mx-auto flex flex-col items-center z-10">
        <div className="flex items-center justify-between w-full mb-4">
          <motion.h1
            className="text-2xl md:text-3xl font-bold text-white font-poppins"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Pomodoro Timer
          </motion.h1>
          
          {/* Add Streak Display component here */}
          {userId && <StreakDisplay userId={userId} />}
        </div>
        
        {/* Tampilkan pesan error sinkronisasi jika ada */}
        {syncError && (
          <motion.div
            className="bg-red-500/70 backdrop-blur-sm text-white p-4 rounded-md mb-6 border border-white/20 max-w-md mx-auto shadow-lg"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="font-poppins">{syncError}</p>
            </div>
            <motion.button 
              className="text-sm underline mt-2 font-poppins flex items-center"
              onClick={() => setSyncError('')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Dismiss
            </motion.button>
          </motion.div>
        )}
        
        {/* Loading indicator */}
        {loading && (
          <div className="flex justify-center items-center my-4">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              className="w-8 h-8 rounded-full border-t-2 border-b-2 border-white"
            />
          </div>
        )}
        
        {/* Mode selector */}
        <motion.div 
          className="flex space-x-1 md:space-x-2 mb-6 md:mb-8 w-full"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {['pomodoro', 'shortBreak', 'longBreak'].map((modeType) => (
            <motion.button
              key={modeType}
              className={`flex-1 px-2 md:px-4 py-1 md:py-2 rounded-md font-poppins text-xs md:text-sm 
                ${mode === modeType ? 'bg-white text-blue-400 font-bold' : 'bg-blue-400 text-white'}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => switchMode(modeType)}
            >
              {modeType === 'pomodoro' ? 'Pomodoro' : 
              modeType === 'shortBreak' ? 'Short Break' : 'Long Break'}
            </motion.button>
          ))}
        </motion.div>

        {/* Lingkaran timer */}
        <motion.div
          className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center mb-6 md:mb-8 p-4 bg-white bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-full shadow-lg"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Lingkaran background */}
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
            
            {/* Lingkaran progress */}
            <svg className="absolute top-0 left-0 w-full h-full -rotate-90" viewBox="0 0 256 256">
              <circle 
                cx="128" 
                cy="128" 
                r={radius} 
                fill="none" 
                stroke="#93c5fd" /* Warna biru muda */
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
            
            {/* Tampilan timer */}
            <div className="absolute flex flex-col items-center">
              <span className="text-4xl sm:text-5xl font-bold text-blue-300 font-poppins" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                {formatTime(minutes, seconds)}
              </span>
              <span className="text-sm sm:text-md mt-2 capitalize font-poppins font-medium text-blue-400">
                {mode === 'pomodoro' ? 'Focus Time' : (mode === 'shortBreak' ? 'Short Break' : 'Long Break')}
              </span>
              {currentTask && (
                <span className="text-xs mt-2 font-poppins text-blue-500 max-w-full px-2 text-center overflow-hidden text-ellipsis">
                  Working on: {currentTask}
                </span>
              )}
            </div>
          </div>
        </motion.div>

        {/* Tombol kontrol */}
        <motion.div 
          className="flex justify-center space-x-3 md:space-x-4 mt-2 md:mt-4 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {!isRunning ? (
            <motion.button
              className="bg-Blue_Pixel3 text-white px-4 md:px-6 py-1 md:py-2 rounded-md font-bold shadow-md font-poppins text-sm md:text-base"
              whileHover={{ scale: 1.05, backgroundColor: "#3b82f6" }}
              whileTap={{ scale: 0.95 }}
              onClick={startTimer}
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-4 h-4 rounded-full border-2 border-white border-t-transparent mr-2"
                  />
                  Starting...
                </div>
              ) : 'Start'}
            </motion.button>
          ) : isPaused ? (
            <motion.button
              className="bg-Blue_Pixel3 text-white px-4 md:px-6 py-1 md:py-2 rounded-md font-bold shadow-md font-poppins text-sm md:text-base"
              whileHover={{ scale: 1.05, backgroundColor: "#3b82f6" }}
              whileTap={{ scale: 0.95 }}
              onClick={resumeTimer}
            >
              Resume
            </motion.button>
          ) : (
            <motion.button
              className="bg-Blue_Pixel3 text-white px-4 md:px-6 py-1 md:py-2 rounded-md font-bold shadow-md font-poppins text-sm md:text-base"
              whileHover={{ scale: 1.05, backgroundColor: "#3b82f6" }}
              whileTap={{ scale: 0.95 }}
              onClick={pauseTimer}
            >
              Pause
            </motion.button>
          )}
          
          <motion.button
            className="bg-blue-200 text-blue-500 px-4 md:px-6 py-1 md:py-2 rounded-md font-bold shadow-md font-poppins text-sm md:text-base"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetTimer}
          >
            Reset
          </motion.button>
        </motion.div>

        {/* Tombol pengaturan */}
        <motion.button
          className="text-white bg-Blue_Pixel3 hover:bg-blue-500 rounded-full px-4 py-2 flex items-center justify-center shadow-md mb-6"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowSettings(!showSettings)}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Timer Settings
        </motion.button>
        
        {/* Bagian tasks */}
        <motion.div
          className="bg-white bg-opacity-90 backdrop-filter backdrop-blur-sm rounded-lg shadow-md p-6 w-full mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-blue-400 font-poppins">Tasks</h2>
            <motion.button
              className="bg-Blue_Pixel3 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-md"
              whileHover={{ scale: 1.1, backgroundColor: "#3b82f6" }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowAddTask(true)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </motion.button>
          </div>
          
          {/* Daftar task */}
          <div className="max-h-64 overflow-y-auto pr-2">
            {tasks.length === 0 ? (
              <div className="text-center text-blue-300 py-4 font-poppins text-sm">
                {loading ? (
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                    className="w-5 h-5 rounded-full border-t-2 border-b-2 border-blue-300 mx-auto mb-2"
                  />
                ) : (
                  <>
                    <p>No tasks added yet</p>
                    <motion.button 
                      onClick={() => setShowAddTask(true)}
                      className="mt-2 text-blue-400 underline font-poppins"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Add your first task
                    </motion.button>
                  </>
                )}
              </div>
            ) : (
              <ul className="space-y-2">
                {tasks.map(task => (
                  <motion.li
                    key={task.id}
                    className={`bg-blue-50 rounded p-3 flex items-center justify-between ${task.completed ? 'opacity-60' : ''}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ backgroundColor: "#e0f2fe" }}
                  >
                    <div className="flex items-center flex-1 min-w-0">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTaskCompletion(task.id)}
                        className="mr-3 h-4 w-4 text-blue-400 rounded"
                      />
                      <p className={`text-blue-500 font-poppins text-xs truncate ${task.completed ? 'line-through' : ''}`}>
                        {task.text}
                      </p>
                    </div>
                    <div className="flex space-x-2 ml-2">
                      {!task.completed && (
                        <button
                          onClick={() => setTask(task.text, task.id)}
                          className={`text-blue-400 p-1 rounded hover:bg-blue-100 ${currentTask === task.text ? 'bg-blue-100' : ''}`}
                          title="Set as current task"
                          disabled={loading}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      )}
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="text-red-400 p-1 rounded hover:bg-red-50"
                        title="Delete task"
                        disabled={loading}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </motion.li>
                ))}
              </ul>
            )}
          </div>
        </motion.div>
        
        {/* Footer */}
        <motion.div
          className="z-20 font-bold mb-10 text-center text-Yellow_Pixel text-sm font-poppins"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          © 2025 FocusFlow. All rights reserved.
        </motion.div>
      </div>

      {/* Popup pengaturan */}
      <AnimatePresence>
        {showSettings && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <motion.div 
              className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSettings(false)}
            />
            
            {/* Konten popup */}
            <motion.div 
              className="relative bg-white/90 backdrop-blur-md rounded-lg shadow-xl p-6 w-11/12 max-w-md m-4 border border-white/20"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <motion.div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-blue-500 font-poppins">Timer Settings</h3>
                </motion.div>
                <button 
                  className="text-gray-400 hover:text-gray-600"
                  onClick={() => setShowSettings(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form>
                <div className="mb-3">
                  <label className="block text-blue-500 font-bold mb-1 text-sm font-poppins">
                    Focus Time (min)
                  </label>
                  <motion.input 
                    type="number"
                    min="1"
                    max="60"
                    className="w-full p-2 border border-blue-200 rounded focus:outline-none focus:border-blue-400 font-poppins"
                    value={customTimes.pomodoro}
                    onChange={(e) => handleTimeChange('pomodoro', e.target.value)}
                    whileFocus={{ scale: 1.02, borderColor: "#3b82f6" }}
                  />
                </div>
                
                <div className="mb-3">
                  <label className="block text-blue-500 font-bold mb-1 text-sm font-poppins">
                    Short Break (min)
                  </label>
                  <motion.input 
                    type="number"
                    min="1"
                    max="60"
                    className="w-full p-2 border border-blue-200 rounded focus:outline-none focus:border-blue-400 font-poppins"
                    value={customTimes.shortBreak}
                    onChange={(e) => handleTimeChange('shortBreak', e.target.value)}
                    whileFocus={{ scale: 1.02, borderColor: "#3b82f6" }}
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-blue-500 font-bold mb-1 text-sm font-poppins">
                    Long Break (min)
                  </label>
                  <motion.input 
                    type="number"
                    min="1"
                    max="60"
                    className="w-full p-2 border border-blue-200 rounded focus:outline-none focus:border-blue-400 font-poppins"
                    value={customTimes.longBreak}
                    onChange={(e) => handleTimeChange('longBreak', e.target.value)}
                    whileFocus={{ scale: 1.02, borderColor: "#3b82f6" }}
                  />
                </div>
                
                <motion.button
                  type="button"
                  className="w-full bg-Blue_Pixel3 text-white font-bold py-2 px-4 rounded hover:bg-blue-500 transition-colors font-poppins"
                  whileHover={{ scale: 1.03, backgroundColor: "#3b82f6" }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setShowSettings(false)}
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        className="w-4 h-4 rounded-full border-2 border-white border-t-transparent mr-2"
                      />
                      Saving...
                    </div>
                  ) : 'Save Settings'}
                </motion.button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Popup tambah task */}
      <AnimatePresence>
        {showAddTask && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <motion.div 
              className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddTask(false)}
            />
            
            {/* Konten popup */}
            <motion.div 
              className="relative bg-white/90 backdrop-blur-md rounded-lg shadow-xl p-6 w-11/12 max-w-md m-4 border border-white/20"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <motion.div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-blue-500 font-poppins">Add New Task</h3>
                </motion.div>
                <button 
                  className="text-gray-400 hover:text-gray-600"
                  onClick={() => setShowAddTask(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={addTask}>
                <div className="mb-4">
                  <label className="block text-blue-500 font-bold mb-1 text-sm font-poppins">
                    Task Description
                  </label>
                  <motion.input
                    type="text"
                    className="w-full p-2 border border-blue-200 rounded focus:outline-none focus:border-blue-400 font-poppins"
                    placeholder="What are you working on?"
                    value={taskInput}
                    onChange={(e) => setTaskInput(e.target.value)}
                    autoFocus
                    whileFocus={{ scale: 1.02, borderColor: "#3b82f6" }}
                    required
                  />
                </div>
                
                <div className="flex justify-end space-x-3">
                  <motion.button
                    type="button"
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md font-poppins hover:bg-gray-300 text-sm"
                    onClick={() => setShowAddTask(false)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    className="px-4 py-2 bg-Blue_Pixel3 text-white rounded-md font-poppins text-sm"
                    disabled={taskInput.trim() === '' || loading}
                    whileHover={{ scale: 1.05, backgroundColor: "#3b82f6" }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <motion.div 
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                          className="w-4 h-4 rounded-full border-2 border-white border-t-transparent mr-2"
                        />
                        Adding...
                      </div>
                    ) : 'Add Task'}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Streak Display Component */}
      <StreakDisplay userId={userId} />
    </div>
  );
};

// Note: StreakDisplay component is now imported from '../components/StreakDisplay'

export default Pomodoro;