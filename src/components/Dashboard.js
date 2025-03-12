import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {

    console.log("User role: ", localStorage.getItem('role'));
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const role = localStorage.getItem('role');
        setIsAdmin(role === 'admin');
    }, []);

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-400 to-purple-600">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-96 text-center">
                <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
                <p>Welcome to the dashboard!</p>
                {isAdmin && (
                    <button
                        className="bg-green-500 text-white p-2 w-full mt-4 rounded hover:bg-green-600"
                        onClick={() => navigate('/register')}
                    >
                        Create Account (Admin Only)
                    </button>
                )}
                <button
                    className="bg-gray-500 text-white p-2 w-full mt-4 rounded hover:bg-gray-600"
                    onClick={() => navigate('/')}
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Dashboard;
