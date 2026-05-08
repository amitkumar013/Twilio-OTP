import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    phoneNumber: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    otpExpiry: {
      type: Date,
      default: Date.now,
      get: (otpExpiry) => otpExpiry.getTime(),
      set: (otpExpiry) => new Date(otpExpiry),
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("User", userSchema);