const express = require("express");
const {
  generateOtpController,
  verifyOtpController,
  getUserProfile,
  updateUser,
  adminLogin,
  verifyOtpAdmin,
} = require("../controllers/userController");
const validator = require("../validations");
const {
  generateOTPVal,
  verifyOTPVal,
  editUserVal,
} = require("../validations/userVal");
// const { authenticateJWT } = require("../validations/authenticateJWT");
const { authenticateJWT } = require("../validations/authenticateJWT");
// const upload = require("../utils/multer");
const upload = require("../helpers/multer");

const router = express.Router();

router.post(
  "/user/generate-otp",
  validator(generateOTPVal),
  generateOtpController
);
router.post("/user/verify-otp", validator(verifyOTPVal), verifyOtpController);
router.get("/user", authenticateJWT, getUserProfile);
router.put(
  "/user",
  authenticateJWT,
  upload.single("image"),
  validator(editUserVal),
  updateUser
);

// ADMINS
router.post("/admin/generate-otp", validator(generateOTPVal), adminLogin);
router.post("/admin/verify-otp", validator(verifyOTPVal), verifyOtpAdmin);

module.exports = router;
