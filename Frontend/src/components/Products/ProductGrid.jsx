import React from 'react';
import { Link } from 'react-router-dom';

const ProductGrid = ({ products, loading, error }) => {
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!products || products.length === 0) return <p>No products available.</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => {
        // Safely get the first image or fallback
        const mainImage = product.images?.[0]?.url || '';
        const altText = product.images?.[0]?.altText || product.name || 'Product Image';

        return (
          <Link key={product._id} to={`/product/${product._id}`} className="block">
            <div className="bg-white p-4 rounded-lg">
              <div className="w-full h-96 mb-4 bg-gray-100 flex items-center justify-center">
                {mainImage ? (
                  <img
                    src={mainImage}
                    alt={altText}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <span className="text-gray-400">No Image</span>
                )}
              </div>
              <h3 className="text-sm mb-2">{product.name || 'Unnamed Product'}</h3>
              <p className="text-gray-500 font-medium text-sm tracking-tighter">
                ₹ {product.price ?? 'N/A'}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default ProductGrid;
