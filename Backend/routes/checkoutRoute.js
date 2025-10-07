const express = require("express");
const Checkout = require("../model/checkout");
const Cart = require("../model/cart");
const Order = require("../model/order");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * @route   POST /api/checkout
 * @desc    Create a new checkout session
 * @access  Private
 */
router.post("/", protect, async (req, res) => {
  const { checkoutItems, shippingAddress, paymentMethod, totalPrice } = req.body;

  if (!checkoutItems || checkoutItems.length === 0) {
    return res.status(400).json({ message: "No items in checkout" });
  }

  try {
    const formattedItems = checkoutItems.map((item) => ({
      productId: item.productId,
      name: item.name,
      image: item.image,
      price: item.price,
      quantity: item.quantity,
      size: item.size,
      color: item.color,
    }));

    const newCheckout = await Checkout.create({
      user: req.user._id,
      checkoutItems: formattedItems,
      shippingAddress: {
        ...shippingAddress,
        country: shippingAddress.country || "India",
      },
      paymentMethod,
      totalPrice,
      paymentStatus: "Pending",
      isPaid: false,
      isFinalized: false,
    });

    res.status(201).json(newCheckout);
  } catch (error) {
    console.error("Error creating checkout session", error);
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   PUT /api/checkout/:id/pay
 * @desc    Mark checkout as paid
 * @access  Private
 */
router.put("/:id/pay", protect, async (req, res) => {
  const { paymentStatus, paymentDetails } = req.body;

  try {
    const checkout = await Checkout.findById(req.params.id);
    if (!checkout) return res.status(404).json({ message: "Checkout not found" });

    if (paymentStatus.toLowerCase() === "paid") {
      checkout.isPaid = true;
      checkout.paymentStatus = paymentStatus;
      checkout.paymentDetails = paymentDetails;
      checkout.paidAt = Date.now();
      await checkout.save();

      res.status(200).json(checkout);
    } else {
      res.status(400).json({ message: "Invalid payment status" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route   POST /api/checkout/:id/finalize
 * @desc    Finalize checkout -> create final order
 * @access  Private
 */
router.post("/:id/finalize", protect, async (req, res) => {
  try {
    const checkout = await Checkout.findById(req.params.id);
    if (!checkout) return res.status(404).json({ message: "Checkout not found" });

    if (!checkout.isPaid)
      return res.status(400).json({ message: "Checkout is not paid" });

    if (checkout.isFinalized)
      return res.status(400).json({ message: "Checkout already finalized" });

    // Create final order
    const finalOrder = await Order.create({
      user: checkout.user,
      orderItems: checkout.checkoutItems,
      shippingAddress: checkout.shippingAddress,
      paymentMethod: checkout.paymentMethod,
      totalPrice: checkout.totalPrice,
      isPaid: true,
      paidAt: checkout.paidAt,
      isDelivered: false,
      paymentStatus: "paid",
      paymentDetails: checkout.paymentDetails,
    });

    // Mark checkout as finalized
    checkout.isFinalized = true;
    checkout.finalizedAt = Date.now();
    await checkout.save();

    // Clear the user’s cart
    await Cart.findOneAndDelete({ user: checkout.user });

    res.status(201).json(finalOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
