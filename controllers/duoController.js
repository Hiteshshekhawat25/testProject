const { playerTypes } = require("../constants");
const { internalServerError, responseHandler } = require("../helpers/utils");
const DuoModel = require("../models/Duo");
const MatchModel = require("../models/Match");
const PlayerModel = require("../models/Player");

// const createTeamName= ()=>{

// }

exports.createDuo = async (req, res) => {
  try {
    const body = req.body;
    const userId = req.userId;
    console.log({ body });

    const match = await MatchModel.findById(body.matchId);
    if (!match) {
      responseHandler({
        res,
        message: "Match doesn't exists!",
        status: 400,
        success: false,
      });
      return;
    }
    const batter = await PlayerModel.findById(body.batterId);
    if (!batter) {
      responseHandler({
        res,
        message: "Batsman doesn't exists!",
        status: 400,
        success: false,
      });
      return;
    }
    if (batter.playerType === playerTypes.BOWLER) {
      responseHandler({
        res,
        message: "Please choose a batsman",
        status: 400,
        success: false,
      });
      return;
    }
    const bowler = await PlayerModel.findById(body.bowlerId);
    if (!bowler) {
      responseHandler({
        res,
        message: "Bowler doesn't exists!",
        status: 400,
        success: false,
      });
      return;
    }
    if (bowler.playerType !== playerTypes.BOWLER) {
      responseHandler({
        res,
        message: "Please choose a bowler",
        status: 400,
        success: false,
      });
      return;
    }

    const data = await DuoModel.create({
      batterId: body.batterId,
      bowlerId: body.bowlerId,
      matchId: body.matchId,
      userId,
    });
    responseHandler({
      res,
      message: "Team created successfully!",
      data,
    });
  } catch (error) {
    internalServerError({ error, req, res });
  }
};

exports.editDuo = async (req, res) => {
  try {
    const body = req.body;
    const exists = await DuoModel.findById(body.duoId);
    if (!exists) {
      responseHandler({
        res,
        message: "Team doesn't exists!",
        status: 400,
        success: false,
      });
      return;
    }

    const newData = await DuoModel.findByIdAndUpdate(
      { _id: body.duoId },
      body,
      {
        new: true,
      }
    );

    responseHandler({
      res,
      message: "Team Edited successfully!",
      data: newData,
    });
  } catch (error) {
    internalServerError({ req, error, res });
  }
};

exports.deleteDuo = async (req, res) => {
  try {
    const duoId = req.query.duoId;

    const exists = await DuoModel.findById(duoId);
    if (!exists) {
      responseHandler({
        res,
        message: "Team doesn't exists!",
        status: 400,
        success: false,
      });
      return;
    }
    const data = await DuoModel.findByIdAndUpdate(
      { _id: duoId },
      { isDeleted: true },
      { new: true }
    );

    responseHandler({ res, message: "Team deleted Successfully!", data });
  } catch (error) {
    internalServerError({ error, req, res });
  }
};

exports.getAllDuo = async (req, res) => {
  try {
    
    responseHandler({
        res,
        message:"Teams fetched successfully!"
    })
  } catch (error) {
    internalServerError({ error, req, res });
  }
};
