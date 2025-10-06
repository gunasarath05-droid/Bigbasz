import React from 'react'
import { RiDeleteBin3Line } from 'react-icons/ri'
import { useDispatch } from 'react-redux'
import { removeFromCart, updateCartItemQuantity } from '../../redux/slices/cartSlice'

const CartContent = ({ cart, userId, guestId }) => {

    const dispatch = useDispatch()

    const handleAddToCart = (productId, delta, quantity, size, color) => {
        const newQuantity = quantity + delta;
        if (newQuantity >= 1) {
            dispatch(
                updateCartItemQuantity({
                    productId,
                    quantity: newQuantity,
                    guestId,
                    userId,
                    size,
                    color,
                })
            )
        }
    }

    const handleRemoveFromCart = (productId, size, color) => {
        dispatch(removeFromCart({ productId,guestId,userId,size,color}))
    }

return (
    <div>
        {cart.products.map((data, index) => (
            <div
                key={index}
                className='flex items-start justify-between py-4 border-b border-gray-300'
            >
                <div className='flex items-start'>
                    <img
                        src={data.image}
                        alt={data.name}
                        className='w-20 h-24 object-cover mr-4 rounded'
                    />
                    <div>
                        <h3>{data.name}</h3>
                        <p className='text-sm text-gray-600'>
                            size: {data.size} | color: {data.color}
                        </p>
                        <div className='flex items-center mt-2'>
                            <button 
                            onClick={()=>
                                handleAddToCart(
                                    data.productId,
                                    -1,
                                    data.quantity,
                                    data.size,
                                    data.color
                                )
                            }
                            className='border border-gray-300 rounded px-2 py-1 text-xl font-medium'>
                                -
                            </button>
                            <span className='mx-4'>{data.quantity}</span>
                            <button
                             onClick={()=>
                                handleAddToCart(
                                    data.productId,
                                    1,
                                    data.quantity,
                                    data.size,
                                    data.color
                                )
                            }
                            className='border border-gray-300 rounded px-2 py-1 text-xl font-medium'>
                                +
                            </button>
                        </div>
                    </div>
                </div>
                <div >
                    <p className='font-medium'>₹ {data.price.toLocaleString()}</p>
                    <button 
                     onClick={()=>
                                handleRemoveFromCart(
                                    data.productId,
                                    data.size,
                                    data.color
                                )
                            }
                    >
                        <RiDeleteBin3Line className='w-6 h-6 mt-2 text-red-600' />
                    </button>
                </div>
            </div>
        ))}
    </div>
)
}

export default CartContent