import Razorpay from "razorpay";

export const rzpInstance = new Razorpay({
  key_id: process.env.REZPAY_KEY!,
  key_secret: "XTKe2KuFk0LbJN0xMJTQIyrj",
});
