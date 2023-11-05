const router = require("express").Router();
const Razorpay = require("razorpay");
const crypto = require("crypto");
const { updatePaymentStatus } = require("./controllers/orderController");
const authController = require("./controllers/authController");
router.use(authController.authenticate);

router.post("/orders", async (req, res) => {
  try {
    const instance = new Razorpay({
      key_id: process.env.KEY_ID,
      key_secret: process.env.KEY_SECRET,
    });

    const options = {
      amount: 500, // change to req.body.amount in production
      currency: "INR",
      receipt: crypto.randomBytes(10).toString("hex"),
    };

    instance.orders.create(options, (err, order) => {
      if (err) {
        // console.log(err);
        return res.status(500).json({ message: "Something went wrong" });
      }
      res.status(200).json({ data: order });
    });
  } catch (err) {
    // console.log(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
});

router.post("/verify", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;
    // console.log(req.body);
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.KEY_SECRET)
      .update(sign.toString())
      .digest("hex");
    if (razorpay_signature === expectedSign) {
      // console.log("hi");
      updatePaymentStatus(req.user._id);
      return res.status(200).json({ message: "payment verified successfully" });
    } else {
      return res.status(400).json({ message: "Invalid signature sent" });
    }
  } catch (err) {
    // console.log(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
});

module.exports = router;
