import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { createProduct } from "../../redux/slices/productSlice";

const AddProductPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state) => state.products);

    const [productData, setProductData] = useState({
        name: "",
        description: "",
        price: "",
        countInStock: 0,
        sku: "",
        category: "",
        brand: "",
        sizes: [],
        colors: [],
        collections: "",
        material: "",
        gender: "",
        images: [],
    });

    const [uploading, setUploading] = useState(false);

    // Handle form inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductData((prev) => ({ ...prev, [name]: value }));
    };

    // Handle image uploads (multiple files)
    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        const uploadedImages = [];

        try {
            setUploading(true);
            for (const file of files) {
                const formData = new FormData();
                formData.append("image", file);

                const { data } = await axios.post(
                    `${import.meta.env.VITE_BACKEND_URL}/api/upload`,
                    formData,
                    { headers: { "Content-Type": "multipart/form-data" } }
                );

                uploadedImages.push({ url: data.imageUrl, altText: "" });
            }

            setProductData((prev) => ({
                ...prev,
                images: [...prev.images, ...uploadedImages],
            }));
        } catch (err) {
            console.error("Image upload failed:", err);
        } finally {
            setUploading(false);
        }
    };

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await dispatch(createProduct(productData)).unwrap(); // send raw productData
            navigate("/admin/products");
        } catch (err) {
            console.error("Product creation failed:", err);
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-6 shadow-md rounded-md">
            <h2 className="text-3xl font-bold mb-6">Add Product</h2>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            <form onSubmit={handleSubmit}>
                <label className="block font-semibold mb-2">Product Name</label>
                <input
                    type="text"
                    name="name"
                    value={productData.name}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-2 rounded-md mb-4"
                    required
                />

                <label className="block font-semibold mb-2">Description</label>
                <textarea
                    name="description"
                    value={productData.description}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-2 rounded-md mb-4"
                    rows={4}
                    required
                />

                <div className="mb-4">
                    <label className="block font-semibold mb-2">Price</label>
                    <input
                        type="number"
                        name="price"
                        value={productData.price}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-2 rounded-md"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block font-semibold mb-2">SKU</label>
                    <input
                        type="text"
                        name="sku"
                        value={productData.sku}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-2 rounded-md"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block font-semibold mb-2">Category</label>
                    <input
                        type="text"
                        name="category"
                        value={productData.category}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-2 rounded-md"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block font-semibold mb-2">Collections</label>
                    <input
                        type="text"
                        name="collections"
                        value={productData.collections}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-2 rounded-md"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block font-semibold mb-2">Gender</label>
                    <select
                        name="gender"
                        value={productData.gender}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-2 rounded-md"
                        required
                    >
                        <option value="">Select Gender</option>
                        <option value="Men">Male</option>
                        <option value="Women">Female</option>
                        <option value="Unisex">Unisex</option>
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block font-semibold mb-2">Count In Stock</label>
                    <input
                        type="number"
                        name="countInStock"
                        value={productData.countInStock}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-2 rounded-md"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block font-semibold mb-2">Sizes (comma-separated)</label>
                    <input
                        type="text"
                        name="sizes"
                        value={productData.sizes.join(",")}
                        onChange={(e) =>
                            setProductData({
                                ...productData,
                                sizes: e.target.value.split(",").map((size) => size.trim()),
                            })
                        }
                        className="w-full border border-gray-300 p-2 rounded-md"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block font-semibold mb-2">Colors (comma-separated)</label>
                    <input
                        type="text"
                        name="colors"
                        value={productData.colors.join(",")}
                        onChange={(e) =>
                            setProductData({
                                ...productData,
                                colors: e.target.value.split(",").map((color) => color.trim()),
                            })
                        }
                        className="w-full border border-gray-300 p-2 rounded-md"
                        required
                    />
                </div>

               <div className='mb-6'>
                    <label className='block font-semibold mb-2'>Upload Image</label>
                    <input type="file" onChange={handleImageUpload} />
                    {uploading && <p>Uploading image...</p>}
                    <div className='flex gap-4 mt-4 flex-wrap'>
                        {productData.images.map((image, index) => (
                            <div key={index} className='relative'>
                                <img
                                    src={image.url}
                                    alt={image.altText || "Product Image"}
                                    className='w-20 h-20 object-cover rounded-md shadow-md'
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setProductData((prevData) => ({
                                            ...prevData,
                                            images: prevData.images.filter((_, i) => i !== index),
                                        }));
                                    }}
                                    className='absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600'
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 mt-6"
                >
                    {loading ? "Saving…" : "Create Product"}
                </button>
            </form>
        </div>
    );
};

export default AddProductPage;
