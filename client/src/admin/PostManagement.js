'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

const PostManagement = () => {
    const [posts, setPosts] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/posts`, {
                    headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
                });
                setPosts(response.data);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };
        fetchPosts();
    }, []);

    const addPost = async () => {
        try {
            const newPost = { title, content };
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/posts`, newPost);
            setPosts([...posts, response.data]);
            setTitle('');
            setContent('');
        } catch (error) {
            console.error('Error adding post:', error);
        }
    };

    const deletePost = async (id) => {
        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/${id}`);
            setPosts(posts.filter(post => post.id !== id));
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    return (
        <div>
            <h2 className='text-2xl font-bold mb-5'>Post Management</h2>
            <div className='mb-5'>
                <input type='text' placeholder='Title' value={title} onChange={(e) => setTitle(e.target.value)} className='border p-2 w-full mb-3' />
                <textarea placeholder='Content' value={content} onChange={(e) => setContent(e.target.value)} className='border p-2 w-full mb-3' />
                <button onClick={addPost} className='bg-green-500 text-white px-3 py-2 rounded'>Add Post</button>
            </div>
            <table className='w-full bg-white shadow-md rounded-lg overflow-hidden'>
                <thead>
                <tr className='bg-gray-200'>
                    <th className='p-3 text-left'>ID</th>
                    <th className='p-3 text-left'>Title</th>
                    <th className='p-3 text-left'>Content</th>
                    <th className='p-3 text-left'>Actions</th>
                </tr>
                </thead>
                <tbody>
                {posts.map(post => (
                    <tr key={post.id} className='border-t'>
                        <td className='p-3'>{post.id}</td>
                        <td className='p-3'>{post.title}</td>
                        <td className='p-3'>{post.content}</td>
                        <td className='p-3'>
                            <button className='bg-blue-500 text-white px-3 py-1 mr-2 rounded'>Edit</button>
                            <button onClick={() => deletePost(post.id)} className='bg-red-500 text-white px-3 py-1 rounded'>Delete</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default PostManagement;