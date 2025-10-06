import { useEffect, useRef, useState } from 'react'
import { FaFilter } from 'react-icons/fa';
import FilterSidebar from '../components/Products/FilterSidebar';
import SortOptions from '../components/Products/SortOptions';
import ProductGrid from '../components/Products/ProductGrid';
import { useLocation, useParams, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductByFilter } from '../redux/slices/productSlice';

const CollectionPage = () => {

    const {collection}=useParams()
    const [searchParams]=useSearchParams()
    const dispatch = useDispatch()
    const {products, loading, error}=useSelector((state)=>state.products)
    const queryParams = Object.fromEntries([...searchParams])
    const location = useLocation()
    
    const sidebarRef = useRef(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(()=>{
        dispatch(fetchProductByFilter({collection, ...queryParams}))
    },[dispatch, collection ,searchParams.toString()])

    const handleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleClickOutside = (e) => {
        if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
            setIsSidebarOpen(false)
        }
    }

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }

    }, [])
    useEffect(()=>{
        window.scrollTo(0,0)
    },[location])

    return (
        <div className='flex flex-col lg:flex-row'>
            <button onClick={handleSidebar} className='lg:hidden border border-gray-300 p-2 flex justify-center items-center'>
                <FaFilter className='mr-2' />Filters
            </button>

            <div ref={sidebarRef} className={`${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} fixed inset-y-0 z-50 left-0 w-64 bg-white overflow-y-auto transition-transform duration-300 lg:static lg:translate-x-0`}>
                <FilterSidebar />
            </div>
            <div className='flex-grow p-4'>
                <h2 className='text-2xl uppercase mb-4'>All Collection</h2>

                <SortOptions />
                <ProductGrid products={products} loading={loading} error={error} />
            </div>
        </div>
    )
}

export default CollectionPage