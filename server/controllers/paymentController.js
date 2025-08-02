import paymentModel from "../models/paymentModel.js";
import Razorpay from "razorpay";
import crypto from "crypto"; // ✅ Needed for signature verification
import dotenv from "dotenv";
dotenv.config();

console.log("KEY_ID:", process.env.RAZORPAY_KEY_ID);
console.log("KEY_SECRET:", process.env.RAZORPAY_KEY_SECRET);

// Razorpay Instance
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create Order API
const createOrder = async (req, res) => {
  try {
    const { amount } = req.body; // ✅ Fix: destructure amount properly

    if (!amount) {
      return res.status(400).json({ success: false, message: "Amount is required" });
    }

    const options = {
      amount: amount * 100, // convert ₹ to paisa
      currency: "INR",
      receipt: "receipt_order_" + new Date().getTime()
    };

    const order = await razorpayInstance.orders.create(options);

    res.json({ success: true, order });
  } catch (error) {
   console.error("Order creation failed:", error); // ✅ FULL error object
    res.status(500).json({ success: false, message: error.message });
  }
};

// Verify Payment API
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");

    const isValid = expectedSignature === razorpay_signature;

    if (isValid) {
      const payment = new paymentModel({
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        signature: razorpay_signature,
        amount
      });

      await payment.save();

      res.json({ success: true, message: "Payment verified and saved" });
    } else {
      res.json({ success: false, message: "Invalid signature" });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export { createOrder, verifyPayment };
