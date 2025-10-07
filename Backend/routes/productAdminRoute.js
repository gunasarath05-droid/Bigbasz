const express = require("express");
const Product = require("../model/product");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// GET all products (already have)
router.get("/", protect, admin, async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


// Create product
router.post('/',protect, admin, async (req, res) => {
  try {
    console.log("Incoming productData:", req.body);

    const newProduct = new Product(req.body); 
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


module.exports = router;
