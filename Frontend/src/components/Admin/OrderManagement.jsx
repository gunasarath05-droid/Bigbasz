import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchAllOrders, updateOrderStatus } from '../../redux/slices/adminOrderSlice';

const OrderManagement = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { user } = useSelector((state) => state.auth)
    const { orders, loading, error } = useSelector((state) => state.adminOrders)

    useEffect(() => {
        if (!user || user.role !== "admin") {
            navigate("/")
        } else {
            dispatch(fetchAllOrders())
        }
    }, [navigate, user, dispatch])

    const handleStatusChange = (orderId, status) => {
        dispatch(updateOrderStatus({ id: orderId, status }))
    };

    if (loading) return <p>Loading...</p>
    if (error) return <p>Error: {error}</p>

    return (
        <div className='max-w-7xl mx-auto p-4 sm:p-6'>
            <h2 className='text-2xl font-bold mb-6'>Order Management</h2>
            <div className='overflow-x-auto'>
                <table className='min-w-full text-left text-gray-500 block sm:table'>
                    <thead className='bg-gray-100 text-xs uppercase text-gray-700 hidden sm:table-header-group'>
                        <tr>
                            <th className='px-4 py-3'>Order Id</th>
                            <th className='px-4 py-3'>Customer</th>
                            <th className='px-4 py-3'>Total Price</th>
                            <th className='px-4 py-3'>Status</th>
                            <th className='px-4 py-3'>Actions</th>
                        </tr>
                    </thead>
                    <tbody className='block sm:table-row-group'>
                        {orders.length > 0 ? (
                            orders.map((data) => (
                                <tr
                                    key={data._id}
                                    className='border-b border-gray-300 block sm:table-row mb-4 sm:mb-0 p-4 sm:p-0'
                                >
                                    <td className='block sm:table-cell p-2 sm:p-4'>
                                        <span className='sm:hidden font-semibold'>Order Id: </span>
                                        #{data._id}
                                    </td>
                                    <td className='block sm:table-cell p-2 sm:p-4'>
                                        <span className='sm:hidden font-semibold'>Customer: </span>
                                        {data.user.name}
                                    </td>
                                    <td className='block sm:table-cell p-2 sm:p-4'>
                                        <span className='sm:hidden font-semibold'>Total Price: </span>
                                        ₹ {data.totalPrice.toFixed(2)}
                                    </td>
                                    <td className='block sm:table-cell p-2 sm:p-4'>
                                        <span className='sm:hidden font-semibold'>Status: </span>
                                        <select
                                            value={data.status}
                                            onChange={(e) => handleStatusChange(data._id, e.target.value)}
                                            className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 w-full'
                                        >
                                            <option value="Processing">Processing</option>
                                            <option value="Shipped">Shipped</option>
                                            <option value="Delivered">Delivered</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                    </td>
                                    <td className='block sm:table-cell p-2 sm:p-4'>
                                        <span className='sm:hidden font-semibold'>Actions: </span>
                                        <button
                                            onClick={() => handleStatusChange(data._id, "Delivered")}
                                            className='bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mt-2 sm:mt-0 inline-block w-full sm:w-auto'
                                        >
                                            Mark as Delivered
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr className='block sm:table-row'>
                                <td colSpan={5} className='p-4 text-center text-gray-500 block sm:table-cell'>
                                    No Orders Found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default OrderManagement
