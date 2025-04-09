import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// Remove MUI Button import if no longer used elsewhere in the file
// import Button from '@mui/material/Button';

const Dashboard = () => {
    console.log("User role: ", localStorage.getItem('role'));

    // Update state to track if user can manage workers
    const [canManageWorkers, setCanManageWorkers] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');

        console.log("Token: ", token);
        console.log("Role: ", role);
        if (!token) {
            navigate('/'); // Redirect to login if no token
        } else {
            // Set state based on role (admin or manager)
            setCanManageWorkers(role === 'admin' || role === 'manager');
        }
    }, [navigate]);

    const goToWorkerManagement = () => {
        navigate('/worker-management'); // Adjust the path based on your router config
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-400 to-purple-600 relative">
            {/* Top Right Buttons */}
            <div className="absolute top-4 right-4 flex flex-col space-y-4 text-sm">
                <button
                    className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
                    onClick={() => {
                        localStorage.clear();
                        navigate('/');
                    }}
                >
                    Logout
                </button>
                {/* Use canManageWorkers for Create Account button visibility if admins can manage workers */}
                {canManageWorkers && localStorage.getItem('role') === 'admin' && ( // Assuming only admins create accounts
                    <button
                        className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
                        onClick={() => navigate('/register')}
                    >
                        Create Account
                    </button>
                )}
            </div>

                                    {/* Dashboard Content */}
            <div className="bg-white p-8 rounded-2xl shadow-xl w-5/6 text-center">
                <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
                <p>Welcome to the dashboard!</p>

                {/* Show Statistics Button */}
                <button
                    className="bg-blue-500 text-white p-2 mt-4 rounded hover:bg-blue-600"
                    onClick={() => navigate('/statistics')}
                >
                    Show Statistics
                </button>

                <button
                        className="bg-purple-500 text-white p-2 mt-4 ml-4 rounded hover:bg-purple-600" // Added ml-4 for spacing
                        onClick={goToWorkerManagement}
                    >
                        Worker Management
                    </button>

                {/* Camera Feed Grid */}
                <div className="grid grid-cols-4 grid-rows-4 gap-2 mt-6">
                    {[...Array(16)].map((_, index) => (
                        <div key={index} className="bg-black w-full h-24 rounded-lg flex items-center justify-center text-white">
                            Camera {index + 1}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
