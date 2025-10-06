import React, { useEffect, useState } from 'react'
import { FiPhoneCall } from 'react-icons/fi'
import { IoLogoInstagram } from 'react-icons/io'
import { RiTwitterXLine } from 'react-icons/ri'
import { TbBrandMeta } from 'react-icons/tb'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { createSubscribe } from '../../redux/slices/subscribeSlice'
import { toast } from 'sonner'

const Footer = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const { subscribe,error } = useSelector((state) => state.subscribe)

    const handleSubmit = (e) => {
        e.preventDefault()
        if (email) {
            dispatch(createSubscribe({email}))
            setEmail("")
            navigate("/")
        }
    }

    useEffect(() => {
        if (subscribe?.message) {
            toast.success(subscribe.message)
        }
        if(error) {
            toast.error(error)
        }
        }, [subscribe,error])

    return (
        <footer className='border-t border-gray-300 py-12'>
            <div className='container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-4 lg:px-0'>
                <div>
                    <h3 className='text-lg text-gray-800 mb-4'>News letter</h3>
                    <p className='text-gray-600 mb-4'>
                        Be the first to hear about new products, exculsive events and online offers.
                    </p>
                    <p className=' font-medium text-sm text-gray-600 mb-6'>Sign up and get 10% off your first order.</p>
                    <form className='flex' onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder='Enter your email'
                            className='p-3 w-full text-sm border-t border-l border-b border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all'
                            required
                             value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <button
                            type='submit'
                           
                            className='bg-black text-white px-6 py-3 text-sm rounded-r-md hover:bg-gray-800 transition-all'
                        >Subscribe</button>
                    </form>
                </div>

                <div>
                    <h3 className='text-lg text-gray-800 mb-4'>Shop</h3>
                    <ul className='space-y-2 text-gray-600'>
                        <li>
                            <Link to="/collections/all?gender=Men&category=Top+Wear" className='hover:text-gray-500 transition-colors'>
                                Men's Top Wear
                            </Link>
                        </li>
                        <li>
                            <Link to="/collections/all?gender=Men&category=Bottom+Wear" className='hover:text-gray-500 transition-colors'>
                                Men's Bottom Wear
                            </Link>
                        </li>
                        <li>
                            <Link to="/collections/all?gender=Women&category=Top+Wear" className='hover:text-gray-500 transition-colors'>
                                Women's Top Wear
                            </Link>
                        </li>
                        <li>
                            <Link to="/collections/all?gender=Women&category=Bottom+Wear" className='hover:text-gray-500 transition-colors'>
                                Women's Bottom Wear
                            </Link>
                        </li>
                    </ul>
                </div>

                <div>
                    <h3 className='text-lg text-gray-800 mb-4'>Support</h3>
                    <ul className='space-y-2 text-gray-600'>
                        <li>
                            <Link to="#" className='hover:text-gray-500 transition-colors'>
                                Contact Us
                            </Link>
                        </li>
                        <li>
                            <Link to="#" className='hover:text-gray-500 transition-colors'>
                                About Us
                            </Link>
                        </li>
                        <li>
                            <Link to="#" className='hover:text-gray-500 transition-colors'>
                                FAQs
                            </Link>
                        </li>
                        <li>
                            <Link to="#" className='hover:text-gray-500 transition-colors'>
                                Features
                            </Link>
                        </li>
                    </ul>
                </div>

                <div>
                    <h3 className='text-lg text-gray-800 mb-4'>Follow Us</h3>
                    <div className='flex items-center space-x-4 mb-6'>
                        <a
                            href="http://www.facebook.com"
                            target='_blank'
                            rel='noopener noreferrer'
                            className='hover:text-gray-500'
                        >
                            <TbBrandMeta className='w-5 h-5' />
                        </a>
                        <a
                            href="http://www.instagram.com"
                            target='_blank'
                            rel='noopener noreferrer'
                            className='hover:text-gray-500'
                        >
                            <IoLogoInstagram className='w-5 h-5' />
                        </a>
                        <a
                            href="http://www.twitter.com"
                            target='_blank'
                            rel='noopener noreferrer'
                            className='hover:text-gray-500'
                        >
                            <RiTwitterXLine className='w-4 h-4' />
                        </a>
                    </div>
                    <p className='text-gray-500 '> Call Us</p>
                    <p>
                        <FiPhoneCall className='inline-block mr-2' />
                        0123-456-789
                    </p>
                </div>
            </div>
            <div className='container mx-auto mt-12 px-4 lg:px-0 border-t border-gray-200 pt-6'>
                <p className='text-gray-500 text-sm tracking-tighter text-center'>
                    ©2025, CompileTab. All Rights Reserved.
                </p>
            </div>
        </footer>
    )
}

export default Footer