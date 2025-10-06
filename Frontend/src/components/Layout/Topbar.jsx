import React from 'react'
import { IoLogoInstagram } from 'react-icons/io'
import { RiTwitterXLine } from 'react-icons/ri'
import { TbBrandMeta } from 'react-icons/tb'

const Topbar = () => {
    return (
        <div className='bg-red-600 text-white'>
            <div className='container mx-auto flex justify-between items-center px-4 py-3'>
                <div className='hidden  md:flex items-center space-x-4'>
                    <a href="http://www.facebook.com" className='hover:text-gray-300'>
                        <TbBrandMeta className='w-5 h-5' />
                    </a>
                     <a href="http://www.instagram.com" className='hover:text-gray-300'>
                        <IoLogoInstagram className='w-5 h-5' />
                    </a>
                     <a href="http://www.twitter.com" className='hover:text-gray-300'>
                        <RiTwitterXLine className='w-4 h-4' />
                    </a>
                </div>
                <div className='text-sm text-center flex-grow'>
                    <span>We ship worldwide - Fast and reliable shipping! </span>
                </div>
                <div className='text-sm hidden md:block'>
                    <a href="tel:+1234567890" className='hover:text-gray-300'>
                        +1 (234) 567-890
                    </a>
                </div>
            </div>
        </div>
    )
}

export default Topbar