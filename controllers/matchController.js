const { internalServerError, responseHandler } = require("../helpers/utils");
const MatchModel = require("../models/Match");

exports.createMatch = async (req, res) => {
  try {
    const body = req.body;
    console.log({ body });

    const matchData = await MatchModel.create(body);
    console.log({ matchData });

    responseHandler({ res, data: matchData,message:"Match Created Successfully!" });
  } catch (error) {
    internalServerError({ req, error, res });
  }
};


exports.editMatch = async(req,res)=>{
  try {
    const body = req.body;
    const exists = await MatchModel.findById(body.matchId);
    if (!exists) {
      responseHandler({
        res,
        message: "Match doesn't exists!",
        status: 400,
        success: false,
      });
      return;
    }

    const newData = await MatchModel.findByIdAndUpdate(
      { _id: body.matchId },
      body,
      {
        new: true,
      }
    );

    responseHandler({
      res,
      message: "Match Edited successfully!",
      data: newData,
    });
  } catch (error) {
    internalServerError({ req, error, res });
  }
}

exports.deleteMatch = async(req,res)=>{
  try {
    const matchId = req.query.matchId;
    console.log({ matchId });

    const exists = await MatchModel.findById(matchId);
    if (!exists) {
      responseHandler({
        res,
        message: "Match doesn't exists!",
        status: 400,
        success: false,
      });
      return;
    }
    const data = await MatchModel.findByIdAndUpdate(
      { _id: matchId },
      { isDeleted: true },
      { new: true }
    );

    responseHandler({ res, message: "Match deleted Successfully!", data });
  } catch (error) {
    internalServerError({error,req,res})
  }
}

exports.getAllMatches = async(req,res)=>{
  try {
    const data = await MatchModel.find();
    console.log({ data });
    responseHandler({ res, message: "Matches fetched successfully!", data });
    
  } catch (error) {
    internalServerError({error,req,res})
  }
}