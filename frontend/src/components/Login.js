import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const Login = ({ setToken, onMsg }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
    e.preventDefault();
    try {
        const formData = new FormData();
        // append the email to 'username' for matching the backend expectations
        formData.append('username', email); 
        formData.append('password', password);

        const response = await api.post('/login', formData);
        
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('userEmail', email);
        setToken(response.data.access_token);
        onMsg("Login Successful! Welcome back.");
        navigate('/');
    } catch (error) {
        // for handling error messages clearly
        const msg = error.response?.status === 404 
            ? "Login endpoint not found. Check backend URL." 
            : "Incorrect email or password";
        onMsg(msg, "error");
    }
};

    return (
        <div className="max-w-md mx-auto bg-white p-10 rounded-2xl shadow-xl border border-slate-100">
            <h2 className="text-2xl font-bold text-slate-800 mb-8 text-center uppercase tracking-widest">Sign In</h2>
            <form onSubmit={handleLogin} className="space-y-6">
                <div>
                    <input type="email" placeholder="Email Address" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition outline-none" 
                        value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                    <input type="password" placeholder="Password" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition outline-none" 
                        value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white p-4 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition transform hover:-translate-y-1">
                    Login
                </button>
            </form>
            <div className="mt-8 text-center border-t border-slate-100 pt-6">
                <p className="text-slate-500">Don't have an account?</p>
                <Link to="/register" className="text-blue-600 font-bold hover:underline">Register here</Link>
            </div>
        </div>
    );
};

export default Login;