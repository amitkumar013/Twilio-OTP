import { User } from "../models/user.model.js";
import { apiResponse } from "../services/apiResponse.js";
import { apiError } from "../services/apiError.js";
import otpGenerator from "otp-generator";
import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN,
);

// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;

// const twilioClient = twilio(accountSid, authToken);

const sendOtp = async (req, res) => {
  const { phoneNumber } = req.body;

  const otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });

  console.log("SID:", process.env.TWILIO_ACCOUNT_SID);
  console.log("TOKEN:", process.env.TWILIO_AUTH_TOKEN);
  console.log("PHONE NUMBER:", process.env.TWILIO_PHONE_NUMBER);

  try {
    if (!phoneNumber) {
      throw new apiError(400, "Phone number is required");
    }

    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    const newOtp = await User.findOneAndUpdate(
      { phoneNumber },
      { phoneNumber, otp, otpExpiry },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
    console.log("NEW OTP 👉", newOtp);

    const twilioClient = await client.messages.create({
      body: `Your OTP is: ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: `+91${phoneNumber}`,
    });
    console.log("TWILIO CLIENT 👉", twilioClient);

    return res
      .status(200)
      .json(new apiResponse(200, newOtp, "Otp sent successfully"));
  } catch (error) {
    console.log("FULL ERROR 👉", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export { sendOtp };
