import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RegisterForm = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('manager');
    const [area, setArea] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const userRole = localStorage.getItem('role');
        if (userRole !== 'admin') {
            navigate('/dashboard'); // Redirect if not admin
        }
    }, [navigate]);

    const handleRegister = async () => {
        try {
            const token = localStorage.getItem('token'); // Admin's auth token
            const response = await axios.post(
                'http://localhost:5000/auth/register',
                { name, username, password, email, role, area },
                {
                    headers: {
                        Authorization: token ? `Bearer ${token}` : '',
                        'Content-Type': 'application/json'
                    }
                }
            );
            setMessage(response.data.message);
            setName('');
            setUsername('');
            setPassword('');
            setEmail('');
            setArea('');
            setRole('manager');
        } catch (error) {
            setMessage(error.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-400 to-purple-600">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-96 text-center">
                <h2 className="text-2xl font-bold mb-4">Register New Account</h2>
                <input
                    className="border p-2 w-full mb-3 rounded"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    className="border p-2 w-full mb-3 rounded"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    className="border p-2 w-full mb-3 rounded"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <input
                    className="border p-2 w-full mb-3 rounded"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <select
                    className="border p-2 w-full mb-3 rounded"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                >
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                </select>
                <select
                    className="border p-2 w-full mb-3 rounded"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                >
                    <option value="V1">V1</option>
                    <option value="V2">V2</option>
                    <option value="V3">V3</option>
                </select>
                <button
                    className="bg-green-500 text-white p-2 w-full mt-4 rounded hover:bg-green-600"
                    onClick={handleRegister}
                >
                    Create Account
                </button>
                {message && <p className="text-red-500 mt-3">{message}</p>}
                <button
                    className="bg-gray-500 text-white p-2 w-full mt-4 rounded hover:bg-gray-600"
                    onClick={() => navigate('/dashboard')}
                >
                    Back to Dashboard
                </button>
            </div>
        </div>
    );
};

export default RegisterForm;
