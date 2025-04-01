const jwt = require("jsonwebtoken");
//internal imports
const {
  internalServerError,
  responseHandler,
  deleteFile,
  deleteImg,
} = require("../helpers/utils");
const UserModel = require("../models/User");
const { JWT_STRING, ROLES } = require("../constants");
// const BASE_URL = process.env.BASE_URL;

exports.generateOtpController = async (req, res) => {
  try {
    const mobileNo = req.body?.mobileNo;
    const role = req.body?.role;

    if (!mobileNo) {
      res.status(403).json({
        message: "Mobile number is Required!",
        status: 403,
        success: false,
      });
      return;
    }

    // let data = await UserModel.findOne({ mobileNo, role });
    let data = await UserModel.findOne({ mobileNo });

    if (!data) {
      //if new user
      //---entry in DB---->>
      data = await UserModel.create({
        mobileNo,
        role: role ? role : ROLES.USER,
        isRegistered: false,
      });
    }

    //----generate otp ----->>
    if (!data?._id) {
      res.status(403).json({
        message: "Something went wrong while generating OTP",
        status: 403,
        success: false,
      });
      return;
    }
    const otpGen = await UserModel.findByIdAndUpdate(
      { _id: data?._id },
      { otp: "123456" },
      { new: true }
    );
    res.status(200).json({
      message: "OTP is sent to your number",
      status: 200,
      success: true,
    });
  } catch (error) {
    internalServerError({ req, error, res });
  }
};

exports.verifyOtpController = async (req, res) => {
  try {
    const mobileNo = req.body?.mobileNo;
    // const role = req.body?.role;
    const otp = req.body?.otp;
    if (!mobileNo) {
      responseHandler({
        res,
        status: 403,
        message: "mobile is required",
        success: false,
      });
      return;
    }
    // if (!role) {
    //   responseHandler(res, 403, "role is required", false);
    //   return;
    // }

    // const user = await UserModel.findOne({ mobileNo, role });
    const user = await UserModel.findOne({ mobileNo });
    if (!user) {
      responseHandler({
        res,
        status: 404,
        message: "User not Found!",
        success: false,
      });
      return;
    }

    //check otp-->
    if (user?.otp !== otp) {
      responseHandler({
        res,
        status: 403,
        message: "Otp verification failed!",
        success: false,
      });
      return;
    }

    //generate Token-->
    const token = jwt.sign({ _id: user?._id }, JWT_STRING);

    const userDetails = await UserModel.findByIdAndUpdate(
      { _id: user?._id },
      { token: token, otp: "" },
      { new: true }
    );

    res.status(200).json({
      message: "User Logged successfully!",
      status: 200,
      success: true,
      data: userDetails,
    });
  } catch (error) {
    internalServerError({ req, error, res });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const userData = await UserModel.findById({ _id: userId }, { __v: 0 });
    responseHandler({
      res,
      status: 200,
      message: "User fetch successfully!",
      success: true,
      data: userData,
    });
  } catch (error) {
    internalServerError({ req, error, res });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const userId = req.userId;
    const body = req.body;
    const file = req?.file;

    const imageURL = `${req?.file?.filename}`;
    if (!userId) {
      responseHandler({
        res,
        status: 403,
        message: "something went wrong!",
        success: false,
        data: {},
      });
    }

    const userData = await UserModel.findById({ _id: userId });
    if (!userData) {
      responseHandler({
        res,
        status: 404,
        message: "User not not",
        data: {},
        success: false,
      });
    }
    const obj = {
      isRegistered: true,
    };
    if (body.name) obj.name = body.name;
    if (body.email) obj.email = body.email;
    if (body.dob) obj.dob = body.dob;
    if (file?.fieldname) obj.image = imageURL;
    // if (body?.role) obj.role = body.role;
    // const contactInfo = { ...userData.contactInfo };
    // if (body?.contactEmail) contactInfo.email = body?.contactEmail;
    // if (body?.contactNumber) contactInfo.mobileNumber = body?.contactNumber;
    // obj.contactInfo = contactInfo;
    console.log("objobj", { obj, imageURL, file });

    const updatedUserData = await UserModel.findByIdAndUpdate(
      { _id: userId },
      obj,
      { new: true }
    );
    //delete old image if exists
    let imagePath = "";
    if (userData.image) {
      imagePath = userData.image;
    }
    if (userData.image && file?.fieldname) {
      deleteImg(imagePath);
    }
    responseHandler({
      res,
      status: 200,
      message: "Profile updated successfully!",
      data: updatedUserData,
    });
  } catch (error) {
    internalServerError({ req, error, res });
  }
};

exports.adminLogin = async (req, res) => {
  try {
    const mobileNo = req.body?.mobileNo;

    if (!mobileNo) {
      res.status(403).json({
        message: "Mobile number is Required!",
        status: 403,
        success: false,
      });
      return;
    }

    let data = await UserModel.findOne({ mobileNo, role: ROLES.ADMIN });

    //----generate otp ----->>
    if (!data?._id) {
      res.status(403).json({
        message: "Not Admin Credentials",
        status: 403,
        success: false,
      });
      return;
    }
    const otpGen = await UserModel.findByIdAndUpdate(
      { _id: data?._id },
      { otp: "123456" },
      { new: true }
    );

    responseHandler({ res, message: "OTP is sent to your number" });
  } catch (error) {
    internalServerError({ error, req, res });
  }
};



exports.verifyOtpAdmin = async (req, res) => {
  try {
    const mobileNo = req.body?.mobileNo;
    // const role = req.body?.role;
    const otp = req.body?.otp;
    if (!mobileNo) {
      responseHandler({
        res,
        status: 403,
        message: "mobile is required",
        success: false,
      });
      return;
    }

    const user = await UserModel.findOne({ mobileNo,role: ROLES.ADMIN });
    if (!user) {
      responseHandler({
        res,
        status: 404,
        message: "User not Found!",
        success: false,
      });
      return;
    }

    //check otp-->
    if (user?.otp !== otp) {
      responseHandler({
        res,
        status: 403,
        message: "Otp verification failed!",
        success: false,
      });
      return;
    }

    //generate Token-->
    const token = jwt.sign({ _id: user?._id }, JWT_STRING);

    const userDetails = await UserModel.findByIdAndUpdate(
      { _id: user?._id },
      { token: token, otp: "" },
      { new: true }
    );

    res.status(200).json({
      message: "User Logged successfully!",
      status: 200,
      success: true,
      data: userDetails,
    });
  } catch (error) {
    internalServerError({ req, error, res });
  }
};
