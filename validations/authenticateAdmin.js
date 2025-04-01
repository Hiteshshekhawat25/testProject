const { internalServerError, responseHandler } = require("../helpers/utils");
const {  ROLES } = require("../constants");
const UserModel = require("../models/User");

exports.authenticateAdmin = async (req, res, next) => {
  try {
     
    const userData = await UserModel.findById(req.userId);
    if (userData.role !== ROLES.ADMIN) {
      responseHandler({
        res,
        message: "Not Authorized to do this action",
        status: 400,
        success: false,
      });
    }
    next();
  } catch (error) {
    internalServerError({req, error, res});
  }
};
