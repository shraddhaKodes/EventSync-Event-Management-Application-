import express from "express";
import {
  createPaymentLink,
  verifyPayment,
  checkAlreadyRSVP
} from "../controller/PaymentController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/create-order", isAuthenticated, createPaymentLink);
router.post("/verify-payment", verifyPayment);
router.post("/check-rsvp",isAuthenticated,checkAlreadyRSVP) ;
export default router;
