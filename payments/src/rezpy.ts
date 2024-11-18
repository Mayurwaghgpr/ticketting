import Razorpay from "razorpay";
import dotenv from "dotenv";
dotenv.config();
if (!process.env.REZPAY_KEY_ID) {
  throw new Error("REZPAY_KEY must be defined");
}

export const rzpInstance = new Razorpay({
  key_id: process.env.REZPAY_KEY_ID!,
  key_secret: process.env.REZPAY_KEY_SECRET!,
});
