const jwt = require("jsonwebtoken");
const { internalServerError, responseHandler } = require("../helpers/utils");
const { JWT_STRING } = require("../constants");
const UserModel = require("../models/User");

exports.authenticateJWT = async (req, res, next) => {
  try {
    const tokenStr = req?.headers?.authorization;

    if (!tokenStr) {
      responseHandler({
        res,
        status: 401,
        message: "Token is missing!",
        success: false,
      });
      return;
    }

    const [str, token] = tokenStr.split(" ");
    if (!token) {
      responseHandler({
        res,
        status: 401,
        message: "Invalid token format!",
        success: false,
      });
      return;
    }

    const { _id } = jwt.verify(token, JWT_STRING);
    const userData = await UserModel.findById(_id);
    console.log(userData?.token, token);

    if (userData?.token !== token) {
      responseHandler({
        res,
        status: 401,
        message: "Token Expired!",
        success: false,
      });
      return;
    }
    req.userId = _id;

    next();
  } catch (error) {
    internalServerError({ req, error, res });
  }
};
