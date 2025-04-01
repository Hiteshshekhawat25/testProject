const {
  internalServerError,
  responseHandler,
  deleteImg,
} = require("../helpers/utils");
const PlayerModel = require("../models/Player");

exports.createPlayer = async (req, res) => {
  try {
    const body = req.body;
    const file = req?.file;
    console.log({ body });
    const data = await PlayerModel.create({ ...body, image: file?.filename });

    responseHandler({ res, message: "Player Successful created!", data });
  } catch (error) {
    internalServerError({ error, req, res });
  }
};

exports.getAllPlayers = async (req, res) => {
  try {
    const data = await PlayerModel.aggregate([
      {
        $lookup: {
          from: "teams",
          localField: "teamId",
          foreignField: "_id",
          as: "teamData",
        },
      },
      {
        $unwind: {
          path: "$teamData",
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);
    console.log({ data });
    responseHandler({ res, message: "Players fetched successfully!", data });
  } catch (error) {
    internalServerError({ error, req, res });
  }
};

exports.editPlayer = async (req, res) => {
  try {
    const body = req.body;
    const file = req.file;
    const exists = await PlayerModel.findById(body.playerId);
    if (!exists) {
      responseHandler({
        res,
        message: "Player doesn't exists!",
        status: 400,
        success: false,
      });
      return;
    }
    if (file?.fieldname) body.image = file?.filename;
    console.log({ file });

    const newData = await PlayerModel.findByIdAndUpdate(
      { _id: body.playerId },
      {
        name: body.name,
        playerType: body.playerType,
        bowling: body.bowling,
        batting: body.batting,
        teamId: body.teamId,
        ...(body.image && { image: body.image }),
      },
      {
        new: true,
      }
    );

    if (exists.image && file?.fieldname) {
      deleteImg(`${exists.image}`);
    }
    responseHandler({
      res,
      message: "Player Edited successfully!",
      data: newData,
    });
  } catch (error) {
    internalServerError({ error, req, res });
  }
};

exports.deletePlayer = async (req, res) => {
  try {
    const playerId = req.query.playerId;
    console.log({ playerId });

    const exists = await PlayerModel.findById(playerId);
    if (!exists) {
      responseHandler({
        res,
        message: "Player doesn't exists!",
        status: 400,
        success: false,
      });
      return;
    }
    const data = await PlayerModel.findByIdAndUpdate(
      { _id: playerId },
      { isDeleted: true },
      { new: true }
    );
    if (exists.image) {
      deleteImg(`${exists.image}`);
    }
    responseHandler({ res, message: "Player deleted Successfully!", data });
  } catch (error) {
    internalServerError({ res, error, req });
  }
};
