import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';

const Dashboard = () => {
    console.log("User role: ", localStorage.getItem('role'));
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();

    // New state for selected camera and current time
    const [selectedCamera, setSelectedCamera] = useState(null);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const token = localStorage.getItem('token'); 
        const role = localStorage.getItem('role');
        console.log("Token: ", token);
        console.log("Role: ", role);
        if (!token) {
            navigate('/'); // Redirect to login if no token
        } else {
            setIsAdmin(role === 'admin');
        }
    }, [navigate]);

    // Update current time every second
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const goToWorkerManagement = () => {
        navigate('/worker-management'); // Adjust the path based on your router config
    };

    const handleCameraClick = (cameraIndex) => {
        setSelectedCamera(cameraIndex);
    };

    const closeCameraModal = () => {
        setSelectedCamera(null);
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
                {isAdmin && (
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

                {/* Show Statistics and Worker Management Buttons */}
                <div className="flex justify-center items-center gap-4">
                    <button
                        className="bg-blue-500 text-white p-2 mt-4 rounded hover:bg-blue-600 min-w-[150px]"
                        onClick={() => navigate('/statistics')}
                    >
                        Show Statistics
                    </button>

                    <button
                        className="bg-purple-500 text-white p-2 mt-4 rounded hover:bg-blue-600 min-w-[150px]"
                        onClick={() => goToWorkerManagement()}
                    >
                        Worker Management
                    </button>
                </div>

                {/* Camera Feed Grid */}
                <div className="grid grid-cols-2 grid-rows-2 gap-2 mt-6">
                    {[...Array(4)].map((_, index) => (
                        <div 
                            key={index} 
                            className="bg-black w-full h-24 rounded-lg flex items-center justify-center text-white"
                            onClick={() => handleCameraClick(index + 1)}
                        >
                            <img
                                src={`http://localhost:8000/api/v1/stream/stream?mode=raw`}
                                alt={`Camera ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Camera Info Modal */}
            {selectedCamera && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg p-6 relative">
                        {/* Top-right current time */}
                        <div className="absolute top-2 right-2 text-sm text-gray-600">
                            {currentTime.toLocaleTimeString()}
                        </div>
                        <h3 className="text-xl font-bold mb-4">Camera {selectedCamera} Feed</h3>
                        <img
                            src={`http://localhost:8000/api/v1/stream/stream?mode=raw`}
                            style={{ width: '640px', height: '480px' }}
                        />
                        <div className="mt-4 flex justify-center gap-8">
                            <Button variant="contained" onClick={closeCameraModal}>
                                Close
                            </Button>
                            <Button variant="contained" onClick={() => navigate('/facial-recognition')}>
                                Facial Recognition
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
