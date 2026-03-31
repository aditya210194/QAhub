import { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Analytics = () => {
    const [analyticsData, setAnalyticsData] = useState([]);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/analytics'); // Update with your API
                setAnalyticsData(response.data);
            } catch (error) {
                console.error('Error fetching analytics data:', error);
            }
        };
        fetchAnalytics();
    }, []);

    return (
        <div>
            <h2 className='text-2xl font-bold mb-5'>Analytics</h2>
            <div className='bg-white shadow-md rounded-lg p-5'>
                <ResponsiveContainer width='100%' height={400}>
                    <LineChart data={analyticsData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray='3 3' />
                        <XAxis dataKey='date' />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type='monotone' dataKey='users' stroke='#8884d8' activeDot={{ r: 8 }} />
                        <Line type='monotone' dataKey='posts' stroke='#82ca9d' />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default Analytics;
