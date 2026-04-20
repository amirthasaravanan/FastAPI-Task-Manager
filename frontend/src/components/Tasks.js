import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const Tasks = ({ token, onMsg }) => {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null); // stores ID of task to delete
    const [filter, setFilter] = useState('all'); // options: 'all', 'completed', 'pending'
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

   const fetchTasks = useCallback(async () => {
    if (!token) return;
    try {
        let url = '/tasks/';
        const params = new URLSearchParams();
        
        if (filter === 'completed') params.append('completed', 'true');
        else if (filter === 'pending') params.append('completed', 'false');

        // This ensures the URL is formed correctly as /tasks/ or /tasks/?completed=true
        const finalUrl = params.toString() ? `${url}?${params.toString()}` : url;

        const response = await api.get(finalUrl);
        setTasks(response.data);
    } catch (error) {
        console.error("Error fetching tasks:", error);
    }
}, [token, filter]);

useEffect(() => { 
    fetchTasks(); 
}, [fetchTasks]);

   const handleAddClick = async (e) => {
    e.preventDefault();
    if (!token) {
        onMsg("Please Login or Register before adding tasks!", "error");
        navigate('/login');
        return;
    }
    try {
        // We include both description and a default completed status
        await api.post('/tasks/', { 
            title: title, 
            description: "", 
            completed: false 
        });
        setTitle('');
        fetchTasks();
        onMsg("Task added successfully!", "success");
    } catch (error) { 
        onMsg("Could not add task. Check if title is empty!", "error"); 
    }
};

// Filter the tasks locally for instant suggestions/results
const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
);

    const handleToggleComplete = async (task) => {
        try {
            // Mark task completed 
            // to send the updated status to the PUT endpoint
            await api.put(`/tasks/${task.id}`, { 
                title: task.title,
                description: task.description || "",
                completed: !task.completed 
            });
            fetchTasks();
            const statusMsg = !task.completed ? "Task marked as completed!" : "Task marked as pending.";
        onMsg(statusMsg);
        } catch (error) { 
            onMsg("Update failed. Check backend PUT route.", "error"); 
        }
    };

    const confirmDelete = async () => {
        if (!showDeleteConfirm) return;
        try {
            // Delete task
            await api.delete(`/tasks/${showDeleteConfirm}`);
            fetchTasks();
            onMsg("Task deleted.");
            setShowDeleteConfirm(null);
        } catch (error) { 
            onMsg("Delete failed", "error"); 
            setShowDeleteConfirm(null);
        }
    };

    return (
        <div className="max-w-2xl space-y-8 relative">
            {/* Confirmation modal for deleting a task */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in zoom-in duration-200">
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Are you sure?</h3>
                        <p className="text-slate-500 mb-6">Do you really want to delete this task? This action cannot be undone.</p>
                        <div className="flex space-x-3">
                            <button 
                                onClick={() => setShowDeleteConfirm(null)}
                                className="flex-1 py-3 rounded-xl font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={confirmDelete}
                                className="flex-1 py-3 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 transition"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* add form for addition of tasks */}
            <div className="flex flex-col gap-4 w-full max-w-4xl mx-auto mb-8">
    {/* Top Row: Add Task */}
    <div className="flex w-full shadow-sm rounded-xl overflow-hidden border border-gray-200 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
        <input 
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a task title..."
            className="flex-1 px-4 py-3 outline-none text-gray-700"
        />
        <button 
            onClick={handleAddClick}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 font-semibold transition-colors"
        >
            Add
        </button>
    </div>

    {/* Bottom Row: Search and Filter Side-by-Side */}
    <div className="flex items-center gap-3 w-full">
        {/* Search Input */}
        <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
            </div>
            <input 
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-gray-200 pl-10 pr-4 py-2.5 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
        </div>

        {/* Compact Filter Dropdown */}
        <div className="relative w-36 shrink-0">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                </svg>
            </div>
            <select 
                value={filter} 
                onChange={(e) => setFilter(e.target.value)}
                className="w-full appearance-none bg-white border border-gray-200 pl-9 pr-8 py-2.5 rounded-xl shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-700 font-medium"
            >
                <option value="all">Filter</option>
                <option value="all">Show All</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
            </select>
        </div>
    </div>
</div>
            {/* Task list section  */}
            <div className="space-y-3">                {token ? (
                    filteredTasks.map(t => (
                        <div key={t.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center transition hover:border-blue-200">
                            <div className="flex items-center space-x-4">
                                <button 
                                    onClick={() => handleToggleComplete(t)}
                                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition ${t.completed ? 'bg-green-500 border-green-500' : 'border-slate-300'}`}
                                >
                                    {t.completed && <i className="fas fa-check text-white text-xs"></i>}
                                </button>
                                
                                <span className={`text-lg font-medium transition ${t.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                                    {t.title}
                                </span>
                            </div>

                            <button 
                                onClick={() => setShowDeleteConfirm(t.id)} 
                                className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition"
                            >
                                <i className="fas fa-trash-alt"></i>
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="p-12 border-2 border-dashed border-slate-200 rounded-3xl text-left text-slate-400 bg-slate-50/50"> 
                    <i className="fas fa-lock mb-3 text-2xl"></i>
                    <p>Login to manage your personal tasks.</p>
                </div>
                )}
            </div>
        </div>
    );
};

export default Tasks;