import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createCheckout } from "../../redux/slices/checkoutSlice";
import axios from "axios";

const Checkout = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch()
  const { cart, loading, error } = useSelector((state) => state.cart)
  const { user } = useSelector((state) => state.auth)


  const [checkoutId, setCheckoutId] = useState(null)
  const [shippingAddress, setShippingAddress] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
  });

  const formattedItems = cart.products.map(p => ({
    productId: p.productId,
    name: p.name,
    image: p.image,
    price: p.price,
    quantity: p.quantity,
    size: p.size,
    color: p.color,
  }));


  useEffect(() => {
    if (!cart || !cart.products || cart.products.length === 0) {
      navigate("/")
    }
  }, [cart, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart && cart.products.length > 0) {
      const res = await dispatch(createCheckout({
        checkoutItems: formattedItems,
        shippingAddress,
        paymentMethod: "Razorpay",
        totalPrice: cart.totalPrice
      })
      )
      if (res.payload && res.payload._id) {
        setCheckoutId(res.payload._id)
      }
    }
  }

  const handleRazorpayPayment = async () => {
    try {
      // 1. Create order from backend
      const { data: order } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/payment/create-order`,
        { amount: cart.totalPrice }
      );

      // 2. Options for Razorpay
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Your Store Name",
        description: "Order Payment",
        order_id: order.id,
        handler: async function (response) {
          // response.razorpay_payment_id, response.razorpay_order_id, response.razorpay_signature
          await axios.put(
            `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/pay`,
            {
              paymentStatus: "Paid",
              paymentDetails: response,
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("userToken")}`,
              },
            }
          );
          await handleFinalizeCheckout(checkoutId);
        },
        prefill: {
          name: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
          email: user?.email,
          contact: shippingAddress.phone,
        },
        theme: { color: "#3399cc" },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error(error);
      alert("Payment initiation failed");
    }
  };


  const handleFinalizeCheckout = async (checkoutId) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/finalize`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`
          }
        }
      )
      navigate("/order-confirmation")
    } catch (error) {
      console.error(error)
    }
  }

  if (loading) return <p>Loading cart...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!cart || !cart.products || cart.products.length === 0) {
    return <p>Your cart is empty</p>
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto py-10 px-6 tracking-tighter">
      <div className="bg-white rounded-lg p-6">
        <h2 className="text-2xl uppercase mb-6">Checkout</h2>
        <form onSubmit={handleSubmit}>
          <h3 className="text-lg mb-4">Contact Details</h3>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input type="email"
              value={user ? user.email : ""}
              className="w-full p-2 border border-gray-300 rounded"
              disabled />
          </div>
          <h3 className="text-lg mb-4">Delivery</h3>
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700">First Name</label>
              <input
                type="text"
                value={shippingAddress.firstName}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    firstName: e.target.value,
                  })}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700">Last Name</label>
              <input
                type="text"
                value={shippingAddress.lastName}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    lastName: e.target.value,
                  })}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
          </div>

          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700">City</label>
              <input
                type="text"
                value={shippingAddress.city}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    city: e.target.value,
                  })}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700">Pin Code</label>
              <input
                type="text"
                value={shippingAddress.postalCode}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    postalCode: e.target.value,
                  })}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Address</label>
            <input
              type="text"
              value={shippingAddress.address}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  address: e.target.value,
                })}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Phone Number</label>
            <input
              type="tel"
              value={shippingAddress.phone}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  phone: e.target.value,
                })}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div className="mt-6">
            {!checkoutId ? (
              <button type="submit" className="w-full bg-black text-white py-3 rounded">
                Continue to Payment
              </button>
            ) : (
              <div>
                <h3 className="mb-4">Pay with Razorpay</h3>
                <button
                  type="button"
                  onClick={handleRazorpayPayment}
                  className="w-full bg-green-600 text-white py-3 rounded"
                >
                    Pay ₹{cart.totalPrice?.toLocaleString()}
                </button>
              </div>
            )}

          </div>
        </form>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg ">
        <h3 className="text-lg mb-4">Order Summary</h3>
        <div className="border-t border-gray-300 py-4 mb-4">
          {cart.products.map((product, index) => (
            <div
              key={index}
              className="flex items-start justify-between border-b border-gray-300 py-2"
            >
              <div className="flex items-start">
                <img src={product.image} alt={product.name} className="w-20 h-24 object-cover mr-4" />
                <div>
                  <h3 className="text-md">{product.name}</h3>
                  <p className="text-gray-500">Size: {product.size}</p>
                  <p className="text-gray-500">Color: {product.color}</p>
                </div>
              </div>
              <p className="text-xl">₹ {product.price?.toLocaleString()}</p>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center text-lg mb-4">
          <p>SubTotal</p>
          <p>₹ {cart.totalPrice?.toLocaleString()}</p>
        </div>
        <div className="flex justify-between items-center text-lg">
          <p>Shipping</p>
          <p>Free</p>
        </div>
        <div className="flex justify-between items-center text-lg mt-4 border-t pt-4 border-gray-300">
          <p>Total</p>
          <p>₹ {cart.totalPrice?.toLocaleString()}</p>
        </div>
      </div>
    </div>
  )
}

export default Checkout