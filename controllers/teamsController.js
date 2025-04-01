const { internalServerError, responseHandler, deleteImg } = require("../helpers/utils");
const TeamModel = require("../models/Teams");

exports.createTeam = async (req, res) => {
  try {
    const body = req.body;
    const file = req.file;

    const exits = await TeamModel.findOne({
      $or: [{ abbreviation: body.abbreviation }, { teamName: body.teamName }],
    });
    if (exits) {
      responseHandler({
        res,
        message: "Team already Exists",
        status: 400,
        success: false,
      });
      return;
    }
    const matchData = await TeamModel.create({ ...body, icon: file.filename });

    responseHandler({ res, data: matchData });
  } catch (error) {
    internalServerError({ req, error, res });
  }
};

exports.getAllTeams = async (req, res) => {
  try {
    const data = await TeamModel.find();
    console.log({ data });
    responseHandler({ res, message: "Teams fetched successfully!", data });
  } catch (error) {
    internalServerError({ error, req, res });
  }
};

exports.editTeam = async (req, res) => {
  try {
    const body = req.body;
    const file = req.file;
    console.log("bodybody", { body });
    const exists = await TeamModel.findById(body.teamId);
    if (!exists) {
      responseHandler({
        res,
        message: "Team doesn't exists!",
        status: 400,
        success: false,
      });
      return;
    }
    if (file?.fieldname) body.icon = file?.filename;
    console.log({ file });

    const newData = await TeamModel.findByIdAndUpdate(
      { _id: body.teamId },
      {
        teamName: body.teamName,
        abbreviation: body.abbreviation,
        ...(body.image && { icon: body.icon }),
      },
      {
        new: true,
      }
    );

    if (exists.icon && file?.fieldname) {
      deleteImg(`${exists.icon}`);
    }
    responseHandler({
      res,
      message: "Team Edited successfully!",
      data: newData,
    });
  } catch (error) {
    internalServerError({ error, req, res });
  }
};
exports.deleteTeam = async (req, res) => {
  try {
    const teamId = req.query.teamId;

    const exists = await TeamModel.findById(teamId);
    if (!exists) {
      responseHandler({
        res,
        message: "Team doesn't exists!",
        status: 400,
        success: false,
      });
      return;
    }
    const data = await TeamModel.findByIdAndUpdate(
      { _id: teamId },
      { isDeleted: true },
      { new: true }
    );
    if (exists.image) {
      deleteImg(`${exists.image}`);
    }
    responseHandler({ res, message: "Team deleted Successfully!", data });
  } catch (error) {
    internalServerError({ error, req, res });
  }
};
