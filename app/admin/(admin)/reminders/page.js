'use client'
import React, { useState, useEffect } from "react";

const NotesPage = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [selectedColor, setSelectedColor] = useState('bg-yellow-200');
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [viewingNote, setViewingNote] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Available background colors for notes
  const colorOptions = [
    { bg: 'bg-yellow-200', border: 'border-yellow-300', name: 'Yellow' },
    { bg: 'bg-blue-200', border: 'border-blue-300', name: 'Blue' },
    { bg: 'bg-green-200', border: 'border-green-300', name: 'Green' },
    { bg: 'bg-pink-200', border: 'border-pink-300', name: 'Pink' },
    { bg: 'bg-purple-200', border: 'border-purple-300', name: 'Purple' },
    { bg: 'bg-orange-200', border: 'border-orange-300', name: 'Orange' },
    { bg: 'bg-red-200', border: 'border-red-300', name: 'Red' },
    { bg: 'bg-gray-200', border: 'border-gray-300', name: 'Gray' },
  ];  // Load notes from localStorage on component mount
  useEffect(() => {
    const loadNotes = () => {
      try {
        const savedNotes = localStorage.getItem('adminNotes');
        if (savedNotes) {
          const parsedNotes = JSON.parse(savedNotes);
          setNotes(parsedNotes);
        } else {
          // Start with empty notes array
          setNotes([]);
        }
      } catch (error) {
        console.error('Error loading notes:', error);
        // Start with empty notes array on error
        setNotes([]);
      }
      setIsLoading(false);
    };

    loadNotes();
  }, []);  // Save notes to localStorage whenever notes change
  useEffect(() => {
    if (!isLoading && notes.length >= 0) {
      localStorage.setItem('adminNotes', JSON.stringify(notes));
    }
  }, [notes, isLoading]);
  // Handle keyboard events for modal
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isModalOpen) {
        closeModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);  // Add new note
  const addNote = () => {
    if (newNote.trim()) {
      const note = {
        id: Date.now(),
        text: newNote.trim(),
        color: selectedColor,
        createdAt: new Date().toISOString()
      };
      
      setNotes(prev => [note, ...prev]);
      setNewNote('');
    }
  };  // Delete note
  const deleteNote = (id) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  };

  // Start editing note
  const startEditing = (id, text) => {
    setEditingId(id);
    setEditingText(text);
  };

  // Save edited note
  const saveEdit = () => {
    if (editingText.trim()) {
      setNotes(prev => prev.map(note => 
        note.id === editingId 
          ? { ...note, text: editingText.trim() }
          : note
      ));
    }
    setEditingId(null);
    setEditingText('');
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null);
    setEditingText('');
  };  // Clear all notes
  const clearAllNotes = () => {
    setNotes([]);
    localStorage.removeItem('adminNotes');
  };

  // Open note in modal
  const openNoteModal = (note) => {
    setViewingNote(note);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setViewingNote(null);
    setIsModalOpen(false);
  };  // Check if text is longer than 2 lines (approximately 100 characters)
  const isTextLong = (text) => {
    return text.length > 100;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your notes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">📝 Notes</h1>
          <p className="text-gray-600">Keep track of your admin tasks and important notes</p>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8">
          <h3 className="text-sm font-semibold text-blue-800 mb-2">💡 How to Use</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Choose a background color for your note before adding it</li>
            <li>• Click the edit icon (✏️) to modify existing notes</li>
            <li>• Click the view icon (👁️) to see the full content of longer notes</li>
            <li>• Click the delete icon (🗑️) to remove notes</li>
            <li>• All notes are automatically saved to your browser&apos;s local storage</li>
            <li>• Use <strong>Clear All Notes</strong> to remove all your notes</li>
          </ul>
        </div>

        {/* Add New Note Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Add New Note</h2>
          
          {/* Color Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Choose Note Color:</label>
            <div className="flex flex-wrap gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color.bg}
                  onClick={() => setSelectedColor(color.bg)}
                  className={`w-8 h-8 rounded-full ${color.bg} border-2 transition-all duration-200 hover:scale-110 ${
                    selectedColor === color.bg 
                      ? 'border-gray-800 ring-2 ring-gray-300' 
                      : 'border-gray-300'
                  }`}
                  title={color.name}
                />
              ))}
            </div>
          </div>          {/* Note Input */}
          <div className="space-y-4">
            {/* Note Text Input */}
            <div className="flex gap-3">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Enter your note..."
                className="flex-1 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="3"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.ctrlKey) {
                    e.preventDefault();
                    addNote();
                  }
                }}
              />
              <button
                onClick={addNote}
                disabled={!newNote.trim()}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 self-start"
              >
                Add Note
              </button>
            </div>
            <p className="text-xs text-gray-500">Tip: Press Ctrl+Enter to quickly add a note</p>
          </div>
        </div>

        {/* Notes Grid */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Your Notes ({notes.length})
            </h2>
            {notes.length > 0 && (
              <button
                onClick={clearAllNotes}
                className="text-sm text-red-600 hover:text-red-800 hover:underline transition-colors duration-200"
              >
                Clear All Notes
              </button>
            )}
          </div>

          {notes.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Notes Yet</h3>
              <p className="text-gray-500">Create your first note to get started!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {notes.map((note) => {
                const colorOption = colorOptions.find(c => c.bg === note.color) || colorOptions[0];
                const isEditing = editingId === note.id;
                
                return (
                  <div
                    key={note.id}
                    className={`${note.color} ${colorOption.border} border-2 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-1 group`}
                  >                    {/* Note Header */}
                    <div className="flex justify-between items-start mb-3">
                      <div className="text-xs text-gray-600 font-medium">
                        <div>{new Date(note.createdAt).toLocaleDateString()}</div>
                      </div>

                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        {isTextLong(note.text) && (
                          <button
                            onClick={() => openNoteModal(note)}
                            className="p-1 hover:bg-white/50 rounded transition-colors duration-200"
                            title="View full note"
                          >
                            👁️
                          </button>
                        )}
                        <button
                          onClick={() => startEditing(note.id, note.text)}
                          className="p-1 hover:bg-white/50 rounded transition-colors duration-200"
                          title="Edit note"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => deleteNote(note.id)}
                          className="p-1 hover:bg-white/50 rounded transition-colors duration-200"
                          title="Delete note"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>

                    {/* Note Content */}
                    {isEditing ? (
                      <div className="space-y-2">
                        <textarea
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          rows="3"
                          autoFocus
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={saveEdit}
                            className="px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition-colors duration-200"
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="px-2 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600 transition-colors duration-200"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>                    ) : (                      <div>
                        <p 
                          className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap overflow-hidden"
                          style={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            maxHeight: '2.5rem' // approximately 2 lines
                          }}
                        >
                          {note.text}
                        </p>
                        {isTextLong(note.text) && (
                          <button
                            onClick={() => openNoteModal(note)}
                            className="text-blue-600 hover:text-blue-800 text-xs mt-1 underline"
                          >
                            View more
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}        </div>

        {/* Modal for viewing full note content */}
        {isModalOpen && viewingNote && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
              {/* Modal Header */}
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">Note Details</h3>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold transition-colors duration-200"
                  title="Close"
                >
                  ×
                </button>
              </div>
              
              {/* Modal Content */}
              <div className="p-6">
                <div className="mb-4">
                  <div className="text-sm text-gray-600 mb-2">
                    Created: {new Date(viewingNote.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                  <div className={`${viewingNote.color} border-2 ${
                    colorOptions.find(c => c.bg === viewingNote.color)?.border || 'border-gray-300'
                  } rounded-lg p-4`}>
                    <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                      {viewingNote.text}
                    </p>
                  </div>
                </div>
                
                {/* Modal Actions */}
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => {
                      startEditing(viewingNote.id, viewingNote.text);
                      closeModal();
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                  >
                    Edit Note
                  </button>
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors duration-200"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesPage;
