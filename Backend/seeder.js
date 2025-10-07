const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./model/product");
const User = require("./model/user");
const Cart = require("./model/cart");
const products = require("./data/products");

dotenv.config();

//connect to mongoDB
mongoose.connect(process.env.MONGO_URI);

// function to seed data

const seedData = async () => {
  try {
    // clear exiting data
    await Product.deleteMany();
    await User.deleteMany();
    await Cart.deleteMany();

    // create default admin user
    const createdUser = await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: "12345678",
      role: "admin",
    });

    // assign the default user id to each product
    const userID = createdUser._id;

    const sampleProducts = products.map((product) => {
      return { ...product, user:userID };
    });

    // insert the products onto the database
    await Product.insertMany(sampleProducts);
    process.exit();
  } catch (error) {
    console.error("Error seeding the data:", error);
    process.exit(1);
  }
};

seedData();

