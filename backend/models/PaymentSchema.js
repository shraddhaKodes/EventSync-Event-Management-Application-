import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: [1, "Amount must be at least ₹1!"],
    },
    orderId: {
      type: String,
      required: true,
    },
    paymentId: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["Pending", "Success", "Failed"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export const Payment = mongoose.model("Payment", paymentSchema);
