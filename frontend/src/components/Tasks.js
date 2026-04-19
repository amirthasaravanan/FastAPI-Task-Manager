import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const Tasks = ({ token, onMsg }) => {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null); // stores ID of task to delete
    const navigate = useNavigate();

    const fetchTasks = useCallback(async () => {
        if (!token) return;
        try {
            const response = await api.get('/tasks/');
            setTasks(response.data);
        } catch (error) { console.error(error); }
    }, [token]);

    useEffect(() => { fetchTasks(); }, [fetchTasks]);

    const handleAddClick = async (e) => {
        e.preventDefault();
        if (!token) {
            onMsg("Please Login or Register before adding tasks!", "error");
            navigate('/login');
            return;
        }
        try {
            // Create task 
            await api.post('/tasks/', { title, description: "" });
            setTitle('');
            fetchTasks();
            onMsg("Task added successfully!");
        } catch (error) { onMsg("Could not add task", "error"); }
    };

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
            <form onSubmit={handleAddClick} className="flex shadow-xl rounded-2xl overflow-hidden border border-slate-200 bg-white">
                <input 
                    className="flex-1 p-5 outline-none text-lg" 
                    placeholder="Enter a task title..." 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    required 
                />
                <button type="submit" className="bg-blue-600 text-white px-8 font-bold text-lg hover:bg-blue-700 transition">
                    Add
                </button>
            </form>

            {/* Task list section  */}
            <div className="space-y-3">                {token ? (
                    tasks.map(t => (
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