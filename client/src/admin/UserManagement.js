import { useState, useEffect } from 'react';
import axios from 'axios';

const UserManagement = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/users'); // Update with your API
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, []);

    const deleteUser = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/users/${id}`);
            setUsers(users.filter(user => user.id !== id));
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

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
                            <button
                                onClick={() => deleteUser(user.id)}
                                className='bg-red-500 text-white px-3 py-1 rounded'>
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserManagement;
