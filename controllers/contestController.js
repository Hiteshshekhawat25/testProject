const { internalServerError, responseHandler } = require("../helpers/utils");
const ContestModel = require("../models/Contest");

exports.createContest = async (req, res) => {
  try {
    const body = req.body;
    const exists = await ContestModel.findOne({ name: body.name });
    if (exists) {
      responseHandler({
        res,
        message: "Contest Already exists!",
        status: 400,
        success: false,
      });
      return;
    }
    const data = await ContestModel.create(body);
    responseHandler({ res, message: "Contest Created successfully!", data });
  } catch (error) {
    internalServerError({ error, req, res });
  }
};

exports.editContest = async (req, res) => {
  try {
    const body = req.body;
    const exists = await ContestModel.findById(body.contestId);
    if (!exists) {
      responseHandler({
        res,
        message: "Contest doesn't exists!",
        status: 400,
        success: false,
      });
      return;
    }

    const newData = await ContestModel.findByIdAndUpdate(
      { _id: body.contestId },
      body,
      {
        new: true,
      }
    );

    responseHandler({
      res,
      message: "Contest Edited successfully!",
      data: newData,
    });
  } catch (error) {
    internalServerError({ error, req, res });
  }
};

exports.deleteContest = async (req, res) => {
  try {
    const contestId = req.query.contestId;
    console.log({ contestId });

    const exists = await ContestModel.findById(contestId);
    if (!exists) {
      responseHandler({
        res,
        message: "Contest doesn't exists!",
        status: 400,
        success: false,
      });
      return;
    }
    const data = await ContestModel.findByIdAndUpdate(
      { _id: contestId },
      { isDeleted: true },
      { new: true }
    );

    responseHandler({ res, message: "Contest deleted Successfully!", data });
  } catch (error) {
    internalServerError({ error, req, res });
  }
};

exports.getAllContest = async (req, res) => {
  try {
    const data = await ContestModel.find();
    console.log({ data });
    responseHandler({ res, message: "Contests fetched successfully!", data });
  } catch (error) {
    internalServerError({ error, req, res });
  }
};
