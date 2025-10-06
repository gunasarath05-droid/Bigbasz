import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addUser, deleteUser, fetchUsers, updateUser } from '../../redux/slices/adminSlice';

const UserManagement = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { user } = useSelector((state) => state.auth)
    const { users, loading, error } = useSelector((state) => state.admin)

    useEffect(() => {
        if (user && user.role !== "admin") {
            navigate("/")
        }
    }, [user, navigate])

    useEffect(() => {
        if (user && user.role === "admin") {
            dispatch(fetchUsers())
        }
    }, [dispatch, user])

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "customer",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(addUser(formData))
        setFormData({ name: "", email: "", password: "", role: "customer" })
    };

    const handleRoleChange = (userId, newRole) => {
        dispatch(updateUser({ id: userId, role: newRole }))
    };

    const handleDeleteUser = (userId) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            dispatch(deleteUser(userId))
        }
    }

    return (
        <div className='max-w-7xl mx-auto p-4 sm:p-6'>
            <h2 className='text-2xl font-bold mb-6'>User Management</h2>

            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}

            {/* Add User Form */}
            <div className='p-6 rounded-lg mb-6 bg-white shadow'>
                <h3 className='text-lg font-bold mb-4'>Add New User</h3>
                <form onSubmit={handleSubmit}>
                    <div className='mb-4'>
                        <label className='block text-gray-700'>Name</label>
                        <input type="text" name='name' value={formData.name} onChange={handleChange}
                            className='w-full p-2 border border-gray-300 rounded' required />
                    </div>
                    <div className='mb-4'>
                        <label className='block text-gray-700'>Email</label>
                        <input type="email" name='email' value={formData.email} onChange={handleChange}
                            className='w-full p-2 border border-gray-300 rounded' required />
                    </div>
                    <div className='mb-4'>
                        <label className='block text-gray-700'>Password</label>
                        <input type="password" name='password' value={formData.password} onChange={handleChange}
                            className='w-full p-2 border border-gray-300 rounded' required />
                    </div>
                    <div className='mb-4'>
                        <label className='block text-gray-700'>Role</label>
                        <select name="role" value={formData.role} onChange={handleChange}
                            className='w-full p-2 border border-gray-300 rounded'>
                            <option value="customer">Customer</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <button type='submit' className='bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600'>
                        Add User
                    </button>
                </form>
            </div>

            {/* User Table */}
            <div className='overflow-x-auto'>
                <table className='min-w-full text-left text-gray-500 block sm:table'>
                    <thead className='bg-gray-100 text-xs uppercase text-gray-700 hidden sm:table-header-group'>
                        <tr>
                            <th className='px-4 py-3'>Name</th>
                            <th className='px-4 py-3'>Email</th>
                            <th className='px-4 py-3'>Role</th>
                            <th className='px-4 py-3'>Actions</th>
                        </tr>
                    </thead>
                    <tbody className='block sm:table-row-group'>
                        {users.map((data) => (
                            <tr key={data._id} className='border-b border-gray-300 block sm:table-row mb-4 sm:mb-0 p-4 sm:p-0'>
                                <td className='block sm:table-cell p-2 sm:p-4'>
                                    <span className='sm:hidden font-semibold'>Name: </span>{data.name}
                                </td>
                                <td className='block sm:table-cell p-2 sm:p-4'>
                                    <span className='sm:hidden font-semibold'>Email: </span>{data.email}
                                </td>
                                <td className='block sm:table-cell p-2 sm:p-4'>
                                    <span className='sm:hidden font-semibold'>Role: </span>
                                    <select value={data.role} onChange={(e) => handleRoleChange(data._id, e.target.value)}
                                        className='p-2 border border-gray-300 rounded w-full sm:w-auto'>
                                        <option value="customer">Customer</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </td>
                                <td className='block sm:table-cell p-2 sm:p-4'>
                                    <span className='sm:hidden font-semibold'>Actions: </span>
                                    <button onClick={() => handleDeleteUser(data._id)}
                                        className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mt-2 sm:mt-0 w-full sm:w-auto'>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default UserManagement
