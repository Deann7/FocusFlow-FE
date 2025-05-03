import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import Cards from '../components/cards';

const Notes = () => {
  const [activeTab, setActiveTab] = useState('create');
  const [notes, setNotes] = useState([]);
  const [completedNotes, setCompletedNotes] = useState([]);
  const [newNote, setNewNote] = useState({ 
    title: '', 
    description: '', 
    deadline: new Date().toISOString().split('T')[0] 
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
    type: 'success'
  });
  
  const apiUrl = 'https://backend-tutam-sbd9-dean.vercel.app';

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
  };

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const userId = getUserId();
      
      if (!userId) {
        setError('Could not authenticate your session. Please log in again.');
        return;
      }
      
      const response = await axios.get(`${apiUrl}/card/user/${userId}`);
      
      if (response.data.success) {
        const allNotes = response.data.payload || [];
        const active = allNotes.filter(note => note.status !== 'selesai');
        const completed = allNotes.filter(note => note.status === 'selesai');
        
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
        deadline: newNote.deadline,
        user_id: userId
      };
      
      const response = await axios.post(`${apiUrl}/card`, noteData);
      
      if (response.data.success) {
        setNewNote({ 
          title: '', 
          description: '', 
          deadline: new Date().toISOString().split('T')[0] 
        });
        fetchNotes();
        setError(null);
        showNotification('Task created successfully! You can view it in the History tab.', 'success');
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
      
      const noteToUpdate = notes.find(note => note.id === id);
      if (!noteToUpdate) return;
      
      const response = await axios.put(`${apiUrl}/card/${id}`, {
        title: noteToUpdate.title,
        description: noteToUpdate.description,
        deadline: noteToUpdate.deadline,
        status: 'selesai'
      });
      
      if (response.data.success) {
        fetchNotes();
        showNotification('Task marked as complete! You can view it in the Done tab.', 'success');
      } else {
        setError(response.data.message || 'Failed to update note');
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.message || 'An error occurred while completing the note');
      } else {
        setError('An error occurred while completing the note');
      }
    } finally {
      setLoading(false);
      closeConfirmationModal();
    }
  };

  const deleteNote = async (id) => {
    try {
      setLoading(true);
      
      const response = await axios.delete(`${apiUrl}/card/${id}`);
      
      if (response.data.success) {
        fetchNotes();
        showNotification('Task deleted successfully!', 'success');
      } else {
        setError(response.data.message || 'Failed to delete note');
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.message || 'An error occurred while deleting the note');
      } else {
        setError('An error occurred while deleting the note');
      }
    } finally {
      setLoading(false);
      closeConfirmationModal();
    }
  };

  const openConfirmationModal = (noteId, action) => {
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
    
    if (action === 'complete') {
      completeNote(noteId);
    } else if (action === 'delete') {
      deleteNote(noteId);
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
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
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

  return (
    <div className="w-full min-h-screen bg-[#3c2a21] flex flex-col">
      <motion.div 
        className="bg-[#1a120b] p-4 shadow-md border-b-2 border-[#d5cea3]"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center container mx-auto">
          <div className="flex items-center">
            <motion.button
              onClick={() => window.location.href = '/'}
              className="bg-[#3c2a21] text-[#d5cea3] px-4 py-2 mr-4 rounded-md border-2 border-[#d5cea3] hover:bg-[#5c4033] flex items-center"
              style={{ fontFamily: 'monospace' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              HOME
            </motion.button>
            <motion.h1 
              className="text-3xl font-bold text-[#d5cea3]"
              style={{ 
                fontFamily: 'monospace',
                textShadow: '2px 2px 0 rgba(0, 0, 0, 0.5)'
              }}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              TASK MANAGER
            </motion.h1>
          </div>
          
          <motion.button
            className="bg-[#3c2a21] text-[#d5cea3] px-4 py-2 rounded-md border-2 border-[#d5cea3] hover:bg-[#5c4033]"
            style={{ fontFamily: 'monospace' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
          >
            LOGOUT
          </motion.button>
        </div>
      </motion.div>

      {notification.show && (
        <motion.div 
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
            notification.type === 'success' ? 'bg-green-700' : 
            notification.type === 'error' ? 'bg-red-700' : 'bg-blue-700'
          } text-white`}
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
        >
          <div className="flex items-center">
            {notification.type === 'success' && (
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            )}
            {notification.type === 'error' && (
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            )}
            <p>{notification.message}</p>
          </div>
        </motion.div>
      )}

      <motion.div 
        className="bg-[#1a120b] border-b-2 border-[#d5cea3] py-2"
        variants={tabContainerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="container mx-auto flex justify-center">
          <motion.button
            className={`px-6 py-3 mx-2 rounded-t-lg font-bold ${
              activeTab === 'create' 
                ? 'bg-[#3c2a21] text-[#d5cea3] border-2 border-b-0 border-[#d5cea3]' 
                : 'bg-[#2c2018] text-[#a79770] hover:bg-[#3c2a21]'
            }`}
            onClick={() => setActiveTab('create')}
            variants={tabVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            CREATE
          </motion.button>
          
          <motion.button
            className={`px-6 py-3 mx-2 rounded-t-lg font-bold ${
              activeTab === 'history' 
                ? 'bg-[#3c2a21] text-[#d5cea3] border-2 border-b-0 border-[#d5cea3]' 
                : 'bg-[#2c2018] text-[#a79770] hover:bg-[#3c2a21]'
            }`}
            onClick={() => setActiveTab('history')}
            variants={tabVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            HISTORY
          </motion.button>
          
          <motion.button
            className={`px-6 py-3 mx-2 rounded-t-lg font-bold ${
              activeTab === 'done' 
                ? 'bg-[#3c2a21] text-[#d5cea3] border-2 border-b-0 border-[#d5cea3]' 
                : 'bg-[#2c2018] text-[#a79770] hover:bg-[#3c2a21]'
            }`}
            onClick={() => setActiveTab('done')}
            variants={tabVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            DONE
          </motion.button>
        </div>
      </motion.div>

      <div className="container mx-auto flex-grow p-6 mt-4">
        {error && (
          <div className="bg-red-700 text-white p-3 rounded-md mb-4">
            <p>{error}</p>
            <button 
              className="text-sm underline mt-1"
              onClick={() => setError(null)}
            >
              Dismiss
            </button>
          </div>
        )}
        
        {loading && (
          <div className="flex justify-center items-center my-4">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#d5cea3]"></div>
          </div>
        )}
        
        {activeTab === 'create' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-[#5c4033] border-2 border-[#d5cea3] rounded-lg p-6 max-w-md mx-auto shadow-lg"
          >
            <h2 className="text-2xl font-bold text-[#d5cea3] mb-4">Create New Task</h2>
            
            <div className="mb-4">
              <label className="block text-[#d5cea3] mb-2">Title *</label>
              <input 
                type="text" 
                className="w-full p-3 bg-[#3c2a21] border-2 border-[#d5cea3] rounded-md text-[#d5cea3] focus:outline-none focus:ring-2 focus:ring-[#a79770]"
                value={newNote.title}
                onChange={(e) => setNewNote({...newNote, title: e.target.value})}
                placeholder="Enter task title"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-[#d5cea3] mb-2">Description</label>
              <textarea 
                className="w-full p-3 bg-[#3c2a21] border-2 border-[#d5cea3] rounded-md text-[#d5cea3] focus:outline-none focus:ring-2 focus:ring-[#a79770] h-32"
                value={newNote.description}
                onChange={(e) => setNewNote({...newNote, description: e.target.value})}
                placeholder="Enter task description"
              ></textarea>
            </div>
            
            <div className="mb-6">
              <label className="block text-[#d5cea3] mb-2">Deadline</label>
              <input 
                type="date" 
                className="w-full p-3 bg-[#3c2a21] border-2 border-[#d5cea3] rounded-md text-[#d5cea3] focus:outline-none focus:ring-2 focus:ring-[#a79770]"
                value={newNote.deadline}
                onChange={(e) => setNewNote({...newNote, deadline: e.target.value})}
              />
            </div>
            
            <motion.button 
              className="w-full bg-[#1a120b] text-[#d5cea3] font-bold py-3 px-4 rounded-md border-2 border-[#d5cea3] hover:bg-[#2c2018]"
              style={{ fontFamily: 'monospace' }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleCreateNote}
              disabled={loading}
            >
              {loading ? 'CREATING...' : 'CREATE TASK'}
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
              <div className="col-span-full text-center text-[#d5cea3] p-8">
                <h3 className="text-xl font-bold mb-2">No active tasks found</h3>
                <p>Click on 'Create' to add a new task</p>
              </div>
            )}
            
            {notes.map(note => (
              <Cards
                key={note.id}
                note={note}
                type="active"
                onComplete={() => openConfirmationModal(note.id, 'complete')}
                formatDate={formatDate}
                isPastDue={isPastDue}
              />
            ))}
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
              <div className="col-span-full text-center text-[#d5cea3] p-8">
                <h3 className="text-xl font-bold mb-2">No completed tasks found</h3>
                <p>Complete your active tasks to see them here</p>
              </div>
            )}
            
            {completedNotes.map(note => (
              <Cards
                key={note.id}
                note={note}
                type="completed"
                onDelete={() => openConfirmationModal(note.id, 'delete')}
                formatDate={formatDate}
                isPastDue={isPastDue}
              />
            ))}
          </motion.div>
        )}
      </div>

      {confirmationModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div 
            className="bg-[#3c2a21] p-6 rounded-lg border-2 border-[#d5cea3] max-w-md w-full"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <h3 className="text-xl font-bold text-[#d5cea3] mb-4">
              {confirmationModal.action === 'complete' 
                ? 'Complete Task' 
                : 'Delete Task'}
            </h3>
            <p className="text-[#d5cea3] mb-6">
              {confirmationModal.action === 'complete' 
                ? 'Are you sure you want to mark this task as complete?' 
                : 'Are you sure you want to delete this task? This action cannot be undone.'}
            </p>
            <div className="flex justify-end space-x-4">
              <motion.button
                className="bg-[#2c2018] text-[#d5cea3] py-2 px-4 rounded-md border border-[#d5cea3]"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={closeConfirmationModal}
              >
                Cancel
              </motion.button>
              <motion.button
                className={`py-2 px-4 rounded-md ${
                  confirmationModal.action === 'complete' 
                    ? 'bg-[#1a120b] text-[#d5cea3] border border-[#d5cea3]' 
                    : 'bg-red-700 text-white'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleConfirmAction}
              >
                {confirmationModal.action === 'complete' ? 'Complete' : 'Delete'}
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Notes;