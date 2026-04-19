import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const Register = ({ onMsg }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            // User registration POST 
            await api.post('/register', { 
                email, 
                password 
            });
            
            onMsg("Registration successful! You can now login.");
            navigate('/login');
        } catch (error) {
            // for PROPER ERROR HANDLING without showing raw server errors 
            const errorDetail = error.response?.data?.detail;
            const message = typeof errorDetail === 'string' 
                ? errorDetail 
                : "Registration failed. Please check your details.";
            
            onMsg(message, "error");
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white p-10 rounded-2xl shadow-xl border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold text-slate-800 mb-8 text-center uppercase tracking-widest">
                Create Account
            </h2>
            
            <form onSubmit={handleRegister} className="space-y-6">
                <div>
                    <input 
                        type="email" 
                        placeholder="Email Address" 
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition outline-none" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                </div>
                <div>
                    <input 
                        type="password" 
                        placeholder="Choose a Password" 
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition outline-none" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                </div>
                
                <button 
                    type="submit" 
                    className="w-full bg-blue-600 text-white p-4 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition transform hover:-translate-y-1 active:scale-95"
                >
                    Register
                </button>
            </form>

            <div className="mt-8 text-center border-t border-slate-100 pt-6">
                <p className="text-slate-500">Already have an account?</p>
                <Link to="/login" className="text-blue-600 font-bold hover:underline transition">
                    Login here
                </Link>
            </div>
        </div>
    );
};

export default Register;