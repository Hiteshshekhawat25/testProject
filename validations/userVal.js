const Joi = require("joi");

const generateOTPVal = Joi.object({
  mobileNo: Joi.string().min(10).max(10).required(),
  // role: Joi.string().optional(),
});

const verifyOTPVal = Joi.object({
  mobileNo: Joi.string().min(10).max(10).required(),
  otp: Joi.string().required(),
});

const editUserVal = Joi.object({
  name: Joi.string().optional(),
  dob: Joi.string().optional(),
  email: Joi.string().optional().email(),
  // role: Joi.string().optional().valid(ROLES.USER, ROLES.RENTAL_BUSINESS),
  // contactEmail: Joi.string().optional().email(),
  // contactNumber: Joi.string().optional(),
});

module.exports = {
  generateOTPVal,
  verifyOTPVal,
  editUserVal,
};
