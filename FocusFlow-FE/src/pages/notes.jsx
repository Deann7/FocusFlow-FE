import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import Cards from '../components/cards';

const Notes = () => {
  const [activeTab, setActiveTab] = useState('create');
  const [notes, setNotes] = useState([]);
  const [completedNotes, setCompletedNotes] = useState([]);
  const [newNote, setNewNote] = useState({ 
    title: '', 
    description: '', 
    deadline: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
    status: 'belum selesai'
  });
  const [confirmationModal, setConfirmationModal] = useState({
    show: false,
    noteId: null,
    action: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: 'success'  });
  
  const apiUrl = 'https://focus-flow-be.vercel.app';

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
      return null;
    }
  };

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    
    const userId = getUserId();
    if (!userId) {
      localStorage.removeItem('isAuthenticated');
      window.location.href = '/login';
      return;
    }
    
    fetchNotes();
  }, []);

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
  };  const fetchNotes = async () => {
    try {
      setLoading(true);
      const userId = getUserId();
      
      if (!userId) {
        setError('Could not authenticate your session. Please log in again.');
        return;
      }
      
      // Clear any existing state to avoid stale data
      setNotes([]);
      setCompletedNotes([]);
      
      const response = await axios.get(`${apiUrl}/card/user/${userId}`);
      console.log('Fetched notes response:', response.data);
      
      if (response.data.success) {
        const allNotes = response.data.payload || [];
        console.log('Total notes fetched:', allNotes.length);
        console.log('All notes sample:', allNotes.length > 0 ? allNotes[0] : 'No notes');
          // Sort notes by deadline (earliest first)
        const sortedNotes = [...allNotes].sort((a, b) => {
          const dateA = new Date(a.deadline);
          const dateB = new Date(b.deadline);
          return dateA - dateB;
        });        // Log what fields each note has to understand the data model
        if (sortedNotes.length > 0) {
          console.log('First note fields:', Object.keys(sortedNotes[0]));
          console.log('First note status value:', sortedNotes[0].status);
        }
        
        // Filter active and completed notes based on 'status' field
        const active = sortedNotes.filter(note => note.status === 'belum selesai');
        const completed = sortedNotes.filter(note => note.status === 'sudah selesai');
        
        console.log('Active notes count:', active.length);
        console.log('Completed notes count:', completed.length);
        if (completed.length > 0) {
          console.log('Sample completed note:', completed[0]);
          console.log('Note ID type:', typeof completed[0].id);
          console.log('Note status:', completed[0].status);
        }
        
        setNotes(active);
        setCompletedNotes(completed);
      } else {
        setError('Failed to fetch notes');
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      
      setError('An error occurred while fetching notes. Please try refreshing the page.');
    } finally {
      setLoading(false);
    }
  };
  const handleCreateNote = async () => {
    try {
      if (!newNote.title.trim()) {
        setError('Title is required');
        return;
      }
      
      setLoading(true);
      const userId = getUserId();
      if (!userId) return;
      
      const noteData = {
        title: newNote.title,
        description: newNote.description || "",
        deadline: `${newNote.deadline}T${newNote.time}`,
        user_id: userId,
        status: 'belum selesai' // Default for new tasks
      };
      
      const response = await axios.post(`${apiUrl}/card`, noteData);
      
      if (response.data.success) {
        setNewNote({ 
          title: '', 
          description: '', 
          deadline: new Date().toISOString().split('T')[0],
          time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
        });
        fetchNotes();
        setError(null);
        showNotification('Task created successfully! You can view it in the Active Tasks tab.', 'success');
        setActiveTab('history');
      } else {
        setError(response.data.message || 'Failed to create note');
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.message || 'An error occurred while creating the note');
      } else {
        setError('An error occurred while creating the note');
      }
    } finally {
      setLoading(false);
    }
  };
  const completeNote = async (id) => {
    try {
      setLoading(true);
      console.log('Attempting to complete note with ID:', id);
      
      const noteToUpdate = notes.find(note => note.id === id);
      if (!noteToUpdate) {
        console.error('Could not find note with ID:', id);
        setError('Could not find the note to update');
        return;
      }
      
      console.log('Original note data:', noteToUpdate);
      const updateData = {
        title: noteToUpdate.title || "",
        description: noteToUpdate.description || "",
        deadline: noteToUpdate.deadline,
        status: 'sudah selesai' // Status selesai - matching the backend enum values
      };
      
      console.log('Sending update data:', updateData);
      console.log('Full update URL:', `${apiUrl}/card/${id}`);
      
      const response = await axios({
        method: 'PUT',
        url: `${apiUrl}/card/${id}`,
        headers: {
          'Content-Type': 'application/json'
        },
        data: updateData
      });
      
      console.log('Complete note response:', response.data);
      if (response.data.success) {
        // Add a short delay before fetching notes to ensure the server has processed the update
        setTimeout(() => {
          fetchNotes();
          // Setelah tugas ditandai selesai, otomatis pindah ke tab "Completed"
          setActiveTab('done');
        }, 500);
        showNotification('Task berhasil diselesaikan! Anda dapat melihatnya di tab Completed.', 'success');
      } else {
        console.error('Server returned unsuccessful response:', response.data);
        setError(response.data.message || 'Failed to update note');
      }
    } catch (error) {
      console.error('Error in completeNote:', error);
      
      if (error.response) {
        console.error('Error response status:', error.response.status);
        console.error('Error response data:', error.response.data);
        
        if (error.response.status === 500) {
          setError('Server error: The server encountered an issue while completing the note. This might be due to invalid data format.');
        } else {
          setError(`Error ${error.response.status}: ${error.response.data?.message || 'Failed to complete note'}`);
        }
      } else if (error.request) {
        console.error('No response received:', error.request);
        setError('No response received from server. Please check your connection.');
      } else {
        console.error('Error details:', error.message);
        setError('An error occurred while completing the note: ' + error.message);
      }
    } finally {
      setLoading(false);
      closeConfirmationModal();
    }
  };  const deleteNote = async (id) => {
    try {
      setLoading(true);
      console.log('Attempting to delete note with ID:', id);
      
      // Make a direct request using the full URL for debugging
      const fullUrl = `${apiUrl}/card/${id}`;
      console.log('Delete request URL:', fullUrl);
      
      // Try with a more explicit axios call
      const response = await axios({
        method: 'DELETE',
        url: fullUrl,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Delete response:', response.data);
      if (response.data.success) {
        fetchNotes();
        showNotification('Task berhasil dihapus!', 'success');
      } else {
        console.error('Failed to delete note. Server returned:', response.data);
        setError(response.data.message || 'Failed to delete note');
      }
    } catch (error) {
      console.error('Error in deleteNote:', error);
      
      if (error.response) {
        console.error('Error response status:', error.response.status);
        console.error('Error response data:', error.response.data);
        setError(`Error ${error.response.status}: ${error.response.data.message || 'Failed to delete note'}`);
      } else if (error.request) {
        console.error('No response received:', error.request);
        setError('No response received from server. Please check your connection.');
      } else {
        console.error('Error details:', error.message);
        setError('An error occurred while deleting the note: ' + error.message);
      }
    } finally {
      setLoading(false);
      closeConfirmationModal();
    }
  };
  const openConfirmationModal = (noteId, action) => {
    console.log('Opening confirmation modal for note ID:', noteId, 'with action:', action);
    setConfirmationModal({
      show: true,
      noteId,
      action
    });
  };

  const closeConfirmationModal = () => {
    setConfirmationModal({
      show: false,
      noteId: null,
      action: null
    });
  };
  const handleConfirmAction = () => {
    const { noteId, action } = confirmationModal;
    console.log('Handling confirmation action:', { action, noteId });
    
    if (action === 'complete') {
      completeNote(noteId);
    } else if (action === 'delete') {
      console.log('Calling deleteNote with ID:', noteId);
      deleteNote(noteId);
    } else {
      console.error('Unknown action type:', action);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    window.location.href = '/';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No deadline';
    
    const date = new Date(dateString);
    
    // Format to Indonesian locale with full date and time, but without forcing timezone
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const isPastDue = (dateString) => {
    if (!dateString) return false;
    
    const today = new Date();
    const deadline = new Date(dateString);
    
    return deadline < today;
  };

  const tabContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const tabVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 }
  };
    const cardContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  // Cloud and Book SVG components
  const Cloud = () => (
    <img src="/cloud.svg" alt="Cloud" className="w-24 h-16" />
  );

  const Book = () => (
    <img src="/book.svg" alt="Book" />
  );
    const NotesIcon = () => (
    <img src="/notes.svg" alt="Notes" className="w-6 h-6" />
  );

  // Cloud positions for animation
  const cloudPositions = [
    { top: '15%', delay: 0, direction: 'right-to-left' },
    { top: '35%', delay: 2, direction: 'left-to-right' },
    { top: '60%', delay: 1, direction: 'right-to-left' },
    { top: '80%', delay: 3, direction: 'left-to-right' }
  ];

  return (
    <div className="w-full min-h-screen bg-blue-300 flex flex-col overflow-hidden relative">
      {/* Animated Clouds - with different directions */}
      {cloudPositions.map((cloud, index) => (
        <motion.div
          key={index}
          className="fixed z-0"
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
    
      <motion.div 
        className="bg-blue-400/30 backdrop-blur-sm border-b border-white/20 p-4 shadow-md z-10"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center container mx-auto">
          <div className="flex items-center">
            <motion.button
              onClick={() => window.location.href = '/landingPage'}
              className="bg-blue-400/30 backdrop-blur-sm text-white px-5 py-2 rounded-full flex items-center text-sm font-poppins border border-white/20"
              whileHover={{ 
                scale: 1.08, 
                backgroundColor: "rgba(96, 165, 250, 0.5)",
                boxShadow: "0 0 15px rgba(255, 255, 255, 0.5)"
              }}
              whileTap={{ scale: 0.92 }}
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
            </motion.button>            <motion.div className="flex items-center">
              <motion.div 
                className="w-10 h-10 border-none bg-yellow-100 rounded-full flex items-center justify-center mr-3"                animate={{ rotate: [0, 0, 5, -5, 0] }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              >
                <NotesIcon />
              </motion.div>
              <motion.h1 
                className="text-3xl font-bold text-white font-poppins"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              >
                Task Manager
              </motion.h1>
            </motion.div>
          </div>
          
          <motion.button
            className="bg-blue-500/40 backdrop-blur-sm text-white px-4 py-2 rounded-md border border-white/20 font-poppins"
            whileHover={{ 
              scale: 1.05, 
              backgroundColor: "rgba(59, 130, 246, 0.6)",
              boxShadow: "0 0 10px rgba(255, 255, 255, 0.4)"
            }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
          >
            Logout
          </motion.button>
        </div>
      </motion.div>

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
                {notification.type === 'success' ? 'Success!' : 
                notification.type === 'error' ? 'Error!' : 'Information'}
              </h4>
              <p className="text-white/90 text-sm">{notification.message}</p>
            </div>
          </div>
          <motion.div 
            className="h-1 bg-white/30 absolute bottom-0 left-0 rounded-full"
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: 5 }}  // Match the duration with notification auto-close
          />
        </motion.div>
      )}<motion.div 
        className="bg-blue-400/20 backdrop-blur-sm mt-4 py-2 z-10"
        variants={tabContainerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="container mx-auto flex justify-center">
          <motion.button
            className={`px-8 py-3 mx-2 rounded-t-lg font-bold font-poppins ${
              activeTab === 'create' 
                ? 'bg-white/70 backdrop-blur-md text-blue-500 border-t border-l border-r border-white/50' 
                : 'bg-blue-500/30 backdrop-blur-sm text-white hover:bg-blue-500/50'
            }`}
            onClick={() => setActiveTab('create')}
            variants={tabVariants}
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 -5px 10px rgba(255, 255, 255, 0.2)"
            }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div className="flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create
            </motion.div>
          </motion.button>
          
          <motion.button
            className={`px-8 py-3 mx-2 rounded-t-lg font-bold font-poppins ${
              activeTab === 'history' 
                ? 'bg-white/70 backdrop-blur-md text-blue-500 border-t border-l border-r border-white/50' 
                : 'bg-blue-500/30 backdrop-blur-sm text-white hover:bg-blue-500/50'
            }`}
            onClick={() => setActiveTab('history')}
            variants={tabVariants}
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 -5px 10px rgba(255, 255, 255, 0.2)"
            }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div className="flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Active Tasks
            </motion.div>
          </motion.button>
          
          <motion.button
            className={`px-8 py-3 mx-2 rounded-t-lg font-bold font-poppins ${
              activeTab === 'done' 
                ? 'bg-white/70 backdrop-blur-md text-blue-500 border-t border-l border-r border-white/50' 
                : 'bg-blue-500/30 backdrop-blur-sm text-white hover:bg-blue-500/50'
            }`}
            onClick={() => setActiveTab('done')}
            variants={tabVariants}
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 -5px 10px rgba(255, 255, 255, 0.2)"
            }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div className="flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Completed
            </motion.div>
          </motion.button>
        </div>
      </motion.div>      <div className="container mx-auto flex-grow p-6 mt-2 z-10">
        {error && (
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
              <p className="font-poppins">{error}</p>
            </div>
            <motion.button 
              className="text-sm underline mt-2 font-poppins flex items-center"
              onClick={() => setError(null)}
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
        
        {loading && (
          <div className="flex justify-center items-center my-8">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              className="w-12 h-12 rounded-full border-t-2 border-b-2 border-white"
            />
          </div>
        )}
        
        {activeTab === 'create' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white/20 backdrop-blur-md rounded-lg p-8 max-w-md mx-auto shadow-lg border border-white/30"
          >
            <motion.div
              className="flex items-center mb-6"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white font-poppins">Create New Task</h2>
            </motion.div>
              <motion.div 
              className="mb-5"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <label className="block text-white font-bold mb-2 font-poppins text-sm">Title *</label>
              <motion.input 
                type="text" 
                className="w-full p-4 bg-white/10 backdrop-blur-sm border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                value={newNote.title}
                onChange={(e) => setNewNote({...newNote, title: e.target.value})}
                placeholder="Enter task title"
                whileFocus={{ scale: 1.02, boxShadow: "0 0 10px rgba(255, 255, 255, 0.3)" }}
              />
            </motion.div>
            
            <motion.div 
              className="mb-5"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <label className="block text-white font-bold mb-2 font-poppins text-sm">Description</label>
              <motion.textarea 
                className="w-full p-4 bg-white/10 backdrop-blur-sm border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50 h-32"
                value={newNote.description}
                onChange={(e) => setNewNote({...newNote, description: e.target.value})}
                placeholder="Enter task description"
                whileFocus={{ scale: 1.02, boxShadow: "0 0 10px rgba(255, 255, 255, 0.3)" }}
              ></motion.textarea>
            </motion.div>
            
            <motion.div 
              className="mb-5"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <label className="block text-white font-bold mb-2 font-poppins text-sm">Deadline</label>
              <div className="flex space-x-3">
                <motion.input 
                  type="date" 
                  className="flex-1 p-4 bg-white/10 backdrop-blur-sm border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                  value={newNote.deadline}
                  onChange={(e) => setNewNote({...newNote, deadline: e.target.value})}
                  whileFocus={{ scale: 1.02, boxShadow: "0 0 10px rgba(255, 255, 255, 0.3)" }}
                />
                <motion.input 
                  type="time" 
                  className="w-1/3 p-4 bg-white/10 backdrop-blur-sm border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                  value={newNote.time}
                  onChange={(e) => setNewNote({...newNote, time: e.target.value})}
                  whileFocus={{ scale: 1.02, boxShadow: "0 0 10px rgba(255, 255, 255, 0.3)" }}
                />
              </div>
              <p className="text-sm text-white/80 mt-2 font-poppins">Format: 24-hour time (WIB)</p>
            </motion.div>
            
            <motion.button 
              className="w-full bg-blue-500 text-white font-bold py-4 px-6 rounded-lg border border-white/20 shadow-lg font-poppins mt-6"
              whileHover={{ 
                scale: 1.03, 
                backgroundColor: "#3b82f6",
                boxShadow: "0 0 15px rgba(255, 255, 255, 0.4)"
              }}
              whileTap={{ scale: 0.97 }}
              onClick={handleCreateNote}
              disabled={loading}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center justify-center">
                {loading ? (
                  <>
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      className="w-5 h-5 rounded-full border-2 border-white border-t-transparent mr-2"
                    />
                    Creating...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Create Task
                  </>
                )}
              </div>
            </motion.button>
          </motion.div>
        )}
          {activeTab === 'history' && (
          <motion.div
            variants={cardContainerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {notes.length === 0 && !loading && (
              <motion.div 
                className="col-span-full text-center text-white p-8 bg-blue-500/20 backdrop-blur-sm rounded-xl border border-white/20 max-w-md mx-auto"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="w-16 h-16 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>                <h3 className="text-xl font-bold mb-2 font-poppins">Tidak ada tugas aktif</h3>
                <p className="text-white/80 font-poppins">Klik 'Create' untuk menambahkan tugas baru</p>
                <motion.button 
                  onClick={() => setActiveTab('create')}
                  className="mt-4 px-5 py-2 bg-blue-500/40 backdrop-blur-sm border border-white/20 rounded-full text-white font-poppins"
                  whileHover={{ 
                    scale: 1.05, 
                    backgroundColor: "rgba(59, 130, 246, 0.6)"
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  Create Task
                </motion.button>
              </motion.div>
            )}
            
            <AnimatePresence>
              {notes.map((note, index) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    transition: { delay: index * 0.1 }
                  }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  whileHover={{ 
                    y: -5,
                    boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
                    transition: { duration: 0.2 }
                  }}
                  className="h-full"
                >
                  <div className="h-full">
                    <Cards
                      note={note}
                      type="active"
                      onComplete={() => openConfirmationModal(note.id, 'complete')}
                      formatDate={formatDate}
                      isPastDue={isPastDue}
                    />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
        
        {activeTab === 'done' && (
          <motion.div
            variants={cardContainerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {completedNotes.length === 0 && !loading && (
              <motion.div 
                className="col-span-full text-center text-white p-8 bg-blue-500/20 backdrop-blur-sm rounded-xl border border-white/20 max-w-md mx-auto"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="w-16 h-16 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>                <h3 className="text-xl font-bold mb-2 font-poppins">Belum ada tugas yang selesai</h3>
                <p className="text-white/80 font-poppins">Selesaikan tugas aktif Anda untuk melihatnya di sini</p>
              </motion.div>
            )}
              <AnimatePresence>
              {completedNotes.map((note, index) => {
                console.log('Rendering completed note:', note);
                return (
                  <motion.div
                    key={note.id || `completed-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0,
                      transition: { delay: index * 0.1 }
                    }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    whileHover={{ 
                      y: -5,
                      boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
                      transition: { duration: 0.2 }
                    }}
                    className="h-full"
                  >
                    <div className="h-full">
                      <Cards
                        note={note}
                        type="completed"
                        onDelete={() => {
                          console.log('Delete triggered for note:', note);
                          openConfirmationModal(note.id, 'delete');
                        }}
                        formatDate={formatDate}
                        isPastDue={isPastDue}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {confirmationModal.show && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div 
            className="bg-white/20 backdrop-blur-lg p-8 rounded-2xl border border-white/30 max-w-md w-full shadow-xl relative overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 15 }}
          >
            {/* Decorative elements */}
            <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-blue-400/20 z-0"></div>
            <div className="absolute -bottom-20 -left-20 w-32 h-32 rounded-full bg-purple-400/20 z-0"></div>
            
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="relative z-10"
            >
              <div className="flex items-center mb-4">
                <div className={`mr-3 p-2 rounded-full ${
                  confirmationModal.action === 'complete' 
                    ? 'bg-blue-500/20' 
                    : 'bg-red-500/20'
                }`}>
                  {confirmationModal.action === 'complete' 
                    ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    )
                  }
                </div>
                <h3 className="text-xl font-bold text-white">
                  {confirmationModal.action === 'complete' 
                    ? 'Complete Task' 
                    : 'Delete Task'}
                </h3>
              </div>
                <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-white/90 mb-8"
              >
                {confirmationModal.action === 'complete' 
                  ? 'Apakah Anda yakin ingin menandai tugas ini sebagai selesai?' 
                  : 'Apakah Anda yakin ingin menghapus tugas ini? Tindakan ini tidak dapat dibatalkan.'}
              </motion.p>
              
              <div className="flex justify-end space-x-4">                <motion.button
                  className="bg-white/10 backdrop-blur-sm text-white py-2.5 px-6 rounded-full border border-white/20 hover:bg-white/20 transition-colors duration-200"
                  whileHover={{ scale: 1.05, boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.15)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={closeConfirmationModal}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  Batal
                </motion.button>
                
                <motion.button
                  className={`py-2.5 px-6 rounded-full shadow-md ${
                    confirmationModal.action === 'complete' 
                      ? 'bg-blue-600/80 hover:bg-blue-700/80 text-white' 
                      : 'bg-red-600/80 hover:bg-red-700/80 text-white'
                  } transition-colors duration-200`}
                  whileHover={{ scale: 1.05, boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.15)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleConfirmAction}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {confirmationModal.action === 'complete' ? 'Selesai' : 'Hapus'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Notes;