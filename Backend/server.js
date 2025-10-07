const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./Config/db");
const userRouter = require("./routes/userRoute");
const productRouter = require("./routes/productRoute");
const cartRouter = require("./routes/cartRoute");
const checkoutRouter = require("./routes/checkoutRoute");
const orderRouter = require("./routes/orderRoute");
const uploadRouter = require("./routes/uploadRoute");
const subscribeRouter = require("./routes/subscribeRoute");
const adminRouter = require("./routes/adminRoute");
const productAdminRouter = require("./routes/productAdminRoute");
const adminOrderRouter = require("./routes/adminOrderRoute");
const paymentRouter = require("./routes/paymentRoute");

const app = express();
app.use(express.json());
app.use(cors());

dotenv.config();

const PORT = process.env.PORT || 4000;

connectDB();

app.get("/", (req, res) => {
  res.send("Welcome");
});

//api routes
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/checkout", checkoutRouter);
app.use("/api/orders", orderRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/subscribe", subscribeRouter);
app.use("/api/payment", paymentRouter);

//admin
app.use("/api/admin/users", adminRouter);
app.use("/api/admin/products", productAdminRouter);
app.use("/api/admin/orders", adminOrderRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
