import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { deleteProduct, fetchAdminProducts } from '../../redux/slices/adminProductSlice';

const ProductManagement = () => {
    const dispatch = useDispatch()
    const { products, loading, error } = useSelector((state) => state.adminProducts)

    useEffect(() => {
        dispatch(fetchAdminProducts())
    }, [dispatch])

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            dispatch(deleteProduct(id))
        }
    };

    if (loading) return <p>Loading...</p>
    if (error) return <p>Error: {error}</p>

    return (
        <div className='max-w-7xl mx-auto p-4 sm:p-6'>
            <div className='flex justify-between'>
                <h2 className='text-2xl font-bold mb-6'>Product Management</h2>
                <Link
                    to="/admin/products/new"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4 inline-block"
                >
                    Add Product
                </Link>
            </div>

            <div className='overflow-x-auto'>
                <table className='min-w-full text-left text-gray-500 border-collapse block sm:table'>
                    <thead className='bg-gray-100 text-xs uppercase text-gray-700 hidden sm:table-header-group'>
                        <tr>
                            <th className='px-4 py-3'>Name</th>
                            <th className='px-4 py-3'>Price</th>
                            <th className='px-4 py-3'>SKU</th>
                            <th className='px-4 py-3'>Actions</th>
                        </tr>
                    </thead>
                    <tbody className='block sm:table-row-group'>
                        {products.length > 0 ? (
                            products.map((data) => (
                                <tr
                                    key={data._id}
                                    className='border-b border-gray-300 block sm:table-row mb-4 sm:mb-0 p-4 sm:p-0'
                                >
                                    {/* Mobile Card Layout */}
                                    <td className='block sm:table-cell p-2 sm:p-4'>
                                        <span className='sm:hidden font-semibold'>Name: </span>
                                        {data.name}
                                    </td>
                                    <td className='block sm:table-cell p-2 sm:p-4'>
                                        <span className='sm:hidden font-semibold'>Price: </span>
                                        {data.price}
                                    </td>
                                    <td className='block sm:table-cell p-2 sm:p-4'>
                                        <span className='sm:hidden font-semibold'>SKU: </span>
                                        {data.sku}
                                    </td>
                                    <td className='block sm:table-cell p-2 sm:p-4'>
                                        <span className='sm:hidden font-semibold'>Actions: </span>
                                        <Link
                                            to={`/admin/products/${data._id}/edit`}
                                            className='bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600 mb-2 sm:mb-0 inline-block'
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(data._id)}
                                            className='bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 inline-block'
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr className='block sm:table-row'>
                                <td colSpan={4} className='p-4 text-center text-gray-500 block sm:table-cell'>
                                    No Products Found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ProductManagement
