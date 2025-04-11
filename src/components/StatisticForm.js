import { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, CartesianGrid } from 'recharts';

export default function StatisticsForm() {
    const [timeframe, setTimeframe] = useState('week');
    const [chartType, setChartType] = useState('bar');
    const [data, setData] = useState([]);

    useEffect(() => {
        fetchStatistics();
    }, [timeframe]);

    const fetchStatistics = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/statistics?timeframe=${timeframe}`);
            setData(res.data.map(entry => ({ period: entry.period.substring(0, 10), total: entry.total_items })));
        } catch (error) {
            console.error("Error fetching statistics:", error);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-400 to-purple-600">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-3/4 text-center">
                <h2 className="text-2xl font-bold mb-4">Warehouse Statistics</h2>

                {/* Dropdowns */}
                <div className="flex justify-center space-x-4 mb-4">
                    <select className="border p-2 rounded" value={timeframe} onChange={e => setTimeframe(e.target.value)}>
                        <option value="week">Weekly</option>
                        <option value="month">Monthly</option>
                        <option value="year">Yearly</option>
                    </select>

                    <select className="border p-2 rounded" value={chartType} onChange={e => setChartType(e.target.value)}>
                        <option value="bar">Bar Chart</option>
                        <option value="line">Line Chart</option>
                    </select>
                </div>

                {/* Chart Display */}
                <div className="flex justify-center">
                    {chartType === "bar" ? (
                        <BarChart width={600} height={300} data={data}>
                            <XAxis dataKey="period" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="total" fill="#4f46e5" />
                        </BarChart>
                    ) : (
                        <LineChart width={600} height={300} data={data}>
                            <XAxis dataKey="period" />
                            <YAxis />
                            <CartesianGrid stroke="#ccc" />
                            <Tooltip />
                            <Line type="monotone" dataKey="total" stroke="#4f46e5" />
                        </LineChart>
                    )}
                </div>
            </div>
        </div>
    );
}
