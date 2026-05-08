import { Router } from "express";
import { sendOtp } from "../controllers/user.controller.js";

const router = Router();


router.route("/send-otp").post(sendOtp)

export default router;