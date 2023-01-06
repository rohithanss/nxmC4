const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
  {
    email: String,
    otp: Number,
  },
  { timestamps: true }
);

otpSchema.index({ updateAt: 1 }, { expireAfterSeconds: 300 });
const OtpModel = mongoose.model("otp", otpSchema);

module.exports = OtpModel;
