import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Dashboard from './Dashboard';
import UserManagement from './UserManagement';
import PostManagement from './PostManagement';
import Analytics from './Analytics';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AdminPortal = () => {
    return (
        <Router>
            <div className='flex'>
                <div className='w-1/5 bg-gray-800 text-white h-screen p-5'>
                    <h2 className='text-xl font-bold mb-5'>Admin Panel</h2>
                    <nav className='flex flex-col gap-3'>
                        <Link to='/admin/dashboard'>Dashboard</Link>
                        <Link to='/admin/users'>User Management</Link>
                        <Link to='/admin/posts'>Post Management</Link>
                        <Link to='/admin/analytics'>Analytics</Link>
                    </nav>
                </div>
                <div className='w-4/5 p-5'>
                    <Routes>
                        <Route path='/admin/dashboard' element={<Dashboard />} />
                        <Route path='/admin/users' element={<UserManagement />} />
                        <Route path='/admin/posts' element={<PostManagement />} />
                        <Route path='/admin/analytics' element={<Analytics />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
};

// --- Dashboard Component ---
const data = [
    { name: 'Jan', users: 120, posts: 50 },
    { name: 'Feb', users: 140, posts: 70 },
    { name: 'Mar', users: 160, posts: 90 },
    { name: 'Apr', users: 180, posts: 110 },
    { name: 'May', users: 200, posts: 130 }
];

const Dashboard = () => (
    <div>
        <h2 className='text-2xl font-bold mb-5'>Dashboard</h2>
        <div className='grid grid-cols-2 gap-4 mb-8'>
            <div className='bg-blue-500 text-white p-5 rounded-lg'>
                <h3 className='text-lg'>Total Users</h3>
                <p className='text-2xl'>150</p>
            </div>
            <div className='bg-green-500 text-white p-5 rounded-lg'>
                <h3 className='text-lg'>Total Posts</h3>
                <p className='text-2xl'>320</p>
            </div>
        </div>
        <div className='bg-white p-5 rounded-lg shadow-md'>
            <h3 className='text-xl font-bold mb-5'>User & Post Growth</h3>
            <ResponsiveContainer width='100%' height={300}>
                <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='name' />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type='monotone' dataKey='users' stroke='#8884d8' />
                    <Line type='monotone' dataKey='posts' stroke='#82ca9d' />
                </LineChart>
            </ResponsiveContainer>
        </div>
    </div>
);

export default AdminPortal;


// --- UserManagement Component ---
import { useState, useEffect } from 'react';

const UserManagement = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        // Placeholder for API call
        setUsers([
            { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin' },
            { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user' }
        ]);
    }, []);

    return (
        <div>
            <h2 className='text-2xl font-bold mb-5'>User Management</h2>
            <table className='w-full bg-white shadow-md rounded-lg overflow-hidden'>
                <thead>
                <tr className='bg-gray-200'>
                    <th className='p-3 text-left'>ID</th>
                    <th className='p-3 text-left'>Name</th>
                    <th className='p-3 text-left'>Email</th>
                    <th className='p-3 text-left'>Role</th>
                    <th className='p-3 text-left'>Actions</th>
                </tr>
                </thead>
                <tbody>
                {users.map(user => (
                    <tr key={user.id} className='border-t'>
                        <td className='p-3'>{user.id}</td>
                        <td className='p-3'>{user.name}</td>
                        <td className='p-3'>{user.email}</td>
                        <td className='p-3'>{user.role}</td>
                        <td className='p-3'>
                            <button className='bg-blue-500 text-white px-3 py-1 mr-2 rounded'>Edit</button>
                            <button className='bg-red-500 text-white px-3 py-1 rounded'>Delete</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};
