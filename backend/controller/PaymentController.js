import { Payment } from "../models/PaymentSchema.js";
import { RSVP } from "../models/RsvpSchema.js";
import dotenv from "dotenv";
import Razorpay from "razorpay";
import crypto from "crypto";

dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// 🎯 Create Order (For Checkout Popup)
export const createPaymentLink = async (req, res) => {
  try {
    const { amount, senderId, receiverId } = req.body;

    if (!amount || !senderId || !receiverId) {
      return res.status(400).json({ success: false, message: "Missing required fields!" });
    }

    const order = await razorpay.orders.create({
      amount: amount * 100, // paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1,
    });
    console.log("Razorpay Order Created:", order);
    const payment = new Payment({
      senderId,
      receiverId,
      amount,
      orderId: order.id,
      paymentId: "vkumarranju9@oksbi",
      status: "Pending",
    });

    await payment.save();

    // ✅ No need to return a custom paymentLink here
    res.json({
      success: true,
      message: "Order created successfully",
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ success: false, message: "Failed to create order" });
  }
};

// 🎯 Verify Payment
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_payment_id: paymentId,
      razorpay_order_id: orderId,
      razorpay_signature,
    } = req.body;
     console.log(req.body) ;
    if (!paymentId || !orderId || !razorpay_signature) {
      return res.status(400).json({ success: false, message: "Missing required fields!" });
    }

    const payment = await Payment.findOne({ orderId });
    if (!payment) {
      return res.status(404).json({ success: false, message: "Payment not found!" });
    }

    // Verify signature
    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(orderId + "|" + paymentId)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid signature!" });
    }

    payment.paymentId = paymentId;
    payment.status = "Success";
    await payment.save();

    res.json({ success: true, message: "Payment verified successfully", payment });
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ success: false, message: "Payment verification failed" });
  }
};
export const checkAlreadyRSVP = async (req, res) => {
  try {
    const senderId = req.user.id; // ✅ secure (from JWT)
    const { eventId, receiverId } = req.body;

    // 🔒 Basic validation
    if (!eventId || !receiverId) {
      return res.status(400).json({
        success: false,
        message: "eventId and receiverId are required",
      });
    }

    // 🔍 Check if RSVP exists (NOT confirmed only)
    const existing = await RSVP.findOne({
      eventId,
      senderId,
      receiverId,
    });

    console.log("FOUND RSVP:", existing);

    return res.status(200).json({
      success: true,
      status: existing ? existing.status : "No RSVP",
      alreadyPurchased: !!existing, // ✅ clean boolean
    });

  } catch (error) {
    console.error("CHECK RSVP ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};