import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
    BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, 
    CartesianGrid, ResponsiveContainer 
} from 'recharts';

export default function StatisticsForm() {
    const navigate = useNavigate();
    const [timeframe, setTimeframe] = useState('daily');
    const [chartType, setChartType] = useState('bar');
    const [statusType, setStatusType] = useState('passed'); // 'passed' for successful, 'failed' for failed
    const [data, setData] = useState([]);

    useEffect(() => {
        fetchStatistics();
    }, [timeframe, statusType]);

    const fetchStatistics = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/statistics?timeframe=${timeframe}&status=${statusType}`);
            // The backend returns period already formatted along with the count
            setData(res.data.map(entry => ({ period: entry.period, total: entry.total_items })));
        } catch (error) {
            console.error("Error fetching statistics:", error);
        }
    };

    return (
        <div 
            className="flex flex-col items-center justify-center bg-gradient-to-br from-blue-400 to-purple-600 min-h-screen"
        >
            <button 
                className="self-start ml-8 border p-2 rounded bg-gradient-to-r from-green-400 to-green-600 text-white hover:from-green-500 hover:to-green-700"
                style={{ marginTop: '-1.5cm' }}
                onClick={() => navigate('/dashboard')}
            >
                &larr; Back
            </button>
            <div className="bg-white p-8 rounded-2xl shadow-xl w-3/4 text-center mt-4">
                <h2 className="text-2xl font-bold mb-2">Warehouse Statistics</h2>

                {/* Dropdowns */}
                <div className="flex justify-center space-x-4 mb-4">
                    <select 
                        className="border p-2 rounded" 
                        value={timeframe} 
                        onChange={e => setTimeframe(e.target.value)}
                    >
                        <option value="daily">Daily</option>
                        <option value="week">Weekly</option>
                        <option value="month">Monthly</option>
                        <option value="year">Yearly</option>
                    </select>
                    
                    <select 
                        className="border p-2 rounded" 
                        value={statusType} 
                        onChange={e => setStatusType(e.target.value)}
                    >
                        <option value="passed">Successful Checkout</option>
                        <option value="failed">Failed Checkout</option>
                    </select>

                    <select 
                        className="border p-2 rounded" 
                        value={chartType} 
                        onChange={e => setChartType(e.target.value)}
                    >
                        <option value="bar">Bar Chart</option>
                        <option value="line">Line Chart</option>
                    </select>
                </div>

                {/* Chart Display */}
                <div className="flex justify-center">
                    {chartType === "bar" ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={data}>
                                <XAxis dataKey="period" />
                                <YAxis label={{ value: 'Total', angle: -90, position: 'insideLeft' }} />
                                <Tooltip animationDuration={0} />
                                <Bar dataKey="total" fill="#4f46e5" />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={data}>
                                <XAxis dataKey="period" />
                                <YAxis label={{ value: 'Total', angle: -90, position: 'insideLeft' }} />
                                <CartesianGrid stroke="#ccc" />
                                <Tooltip animationDuration={0} />
                                <Line type="monotone" dataKey="total" stroke="#4f46e5" />
                            </LineChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>
        </div>
    );
}
