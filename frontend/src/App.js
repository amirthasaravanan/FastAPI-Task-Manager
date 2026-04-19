import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Tasks from './components/Tasks';
import api from './services/api';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [userEmail, setUserEmail] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [userMessage, setUserMessage] = useState(null);

  
  useEffect(() => {
    if (token) {
      
      api.get('/tasks/').then(() => {
          
          
          setUserEmail(localStorage.getItem('userEmail'));
      }).catch(() => logout());
    }
  }, [token]);

  
useEffect(() => {
  const handleClickOutside = (event) => {
    
    if (!event.target.closest('.profile-container')) {
      setShowProfile(false);
    }
  };

  if (showProfile) {
    document.addEventListener('mousedown', handleClickOutside);
  }
  return () => document.removeEventListener('mousedown', handleClickOutside);
}, [showProfile]);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    setToken(null);
    setUserEmail(null);
    setShowProfile(false);
    showMsg("Logged out successfully");
  };

  const showMsg = (text, type = 'success') => {
    setUserMessage({ text, type });
    setTimeout(() => setUserMessage(null), 4000);
  };

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 relative">
        {/* Navigation Bar */}
        <nav className="bg-slate-900 shadow-lg p-4 sticky top-0 z-40 w-full">
  <div className="flex justify-between items-center w-full px-8"> 
    
    {/* Logo */}
    <div className="max-w-4xl w-full">
      <Link to="/" className="text-xl font-bold text-white flex items-center group">
        <i className="fas fa-tasks text-blue-400 mr-2 group-hover:scale-110 transition-transform"></i> 
        Task Manager
      </Link>
    </div>
    
    {/* Auth & Profile buttons */}
    <div className="flex items-center space-x-4 relative whitespace-nowrap">
      
      <Link to="/login" className="bg-white text-slate-900 px-5 py-2 rounded-lg font-bold text-sm hover:bg-slate-100 transition shadow-sm">
        Login
      </Link>

      <Link to="/register" className="bg-white text-slate-900 px-5 py-2 rounded-lg font-bold text-sm hover:bg-slate-100 transition shadow-sm">
        Register
      </Link>
      
      {/* profile container */}
      <div className="relative profile-container">
        <button 
          onClick={() => setShowProfile(!showProfile)}
          className={`ml-2 w-10 h-10 rounded-full flex items-center justify-center border transition ${
            showProfile 
              ? 'bg-slate-700 border-blue-500 ring-2 ring-blue-500/50' 
              : 'bg-slate-800 border-slate-700 hover:bg-slate-700'
          }`}
        >
          <i className="fas fa-user text-white"></i>
        </button>

        {/* profile card */}
        {showProfile && (
          <div className="absolute -right-4 top-14 w-80 max-w-[calc(100vw-2rem)] bg-white shadow-2xl rounded-2xl p-6 border border-slate-100 z-50 animate-in fade-in zoom-in duration-200">
            {token ? (
              <div className="space-y-4 flex flex-col">
                <div className="overflow-hidden">
                  <p className="text-[11px] text-blue-500 font-bold uppercase tracking-[0.2em] mb-1">
                    Authenticated User
                  </p>
                  <p className="text-slate-900 font-bold text-lg break-all whitespace-normal">
                    {userEmail}
                  </p>
                </div>
                <div className="pt-2">
                  <button 
                    onClick={logout} 
                    className="w-full bg-red-500 text-white py-3 rounded-xl font-bold hover:bg-red-600 shadow-lg hover:shadow-red-200 transition-all active:scale-95"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-4">
                <p className="text-slate-500 font-medium text-center whitespace-normal leading-relaxed">
                  Please login to manage your profile settings.
                </p>
              </div>
            )}
          </div>
        )} 
      </div> 
    </div>
  </div>
</nav>

        
        {userMessage && (
          <div className={`fixed top-24 right-5 p-4 rounded-xl shadow-2xl text-white font-bold z-50 animate-bounce ${userMessage.type === 'error' ? 'bg-red-500' : 'bg-green-500'}`}>
            {userMessage.text}
          </div>
        )}

        <main className="w-full py-12 px-8 min-h-[80vh] flex flex-col">
  <Routes>
    
    <Route path="/" element={
      <div className="max-w-4xl space-y-12 text-left">
        <h1 className="text-4xl font-extrabold text-slate-900 whitespace-nowrap">
          Streamline Your Productivity with Secure Task Management
        </h1>
        <p className="text-lg text-slate-500 whitespace-nowrap">
          View, track, and complete your tasks using secure credentials, ensuring industry-standard authentication and verified data privacy.
        </p>
        <Tasks token={token} onMsg={showMsg} />
      </div>
    } />

    
    <Route path="/login" element={
      <div className="flex-1 flex flex-col items-center justify-center w-full -mt-20">
        <div className="w-full max-w-md"> 
          <Login setToken={setToken} onMsg={showMsg} />
        </div>
      </div>
    } />
    
    <Route path="/register" element={
      <div className="flex-1 flex flex-col items-center justify-center w-full -mt-20">
        <div className="w-full max-w-md"> 
          <Register onMsg={showMsg} />
        </div>
      </div>
    } />
  </Routes>
</main>
      </div>
    </Router>
  );
}

export default App;