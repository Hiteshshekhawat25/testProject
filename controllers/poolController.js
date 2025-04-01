const { default: mongoose } = require("mongoose");
const { ROLES } = require("../constants");
const { internalServerError, responseHandler } = require("../helpers/utils");
const ContestModel = require("../models/Contest");
const MatchModel = require("../models/Match");
const PoolModel = require("../models/Pool");
const UserModel = require("../models/User");

exports.joinPool = async (req, res) => {
  // try {
  //   const body = req.body;
  //   const userId = req.userId;

  //   const isContest = await ContestModel.findById(body.contestId);
  //   if (!isContest) {
  //     //checking if contest exists -->>
  //     responseHandler({
  //       res,
  //       message: "Contest doesn't exists",
  //       status: 400,
  //       success: false,
  //     });
  //     return;
  //   }
  //   const isMatch = await MatchModel.findById(body.matchId);
  //   if (!isMatch) {
  //     //checking if match exists -->>>
  //     responseHandler({
  //       res,
  //       message: "Match doesn't exists",
  //       status: 400,
  //       success: false,
  //     });
  //     return;
  //   }

  //   const isDuo = await MatchModel.findById(body.duoId);
  //   if (!isDuo) {
  //     //checking if duo exists -->>>
  //     responseHandler({
  //       res,
  //       message: "Duo doesn't exists",
  //       status: 400,
  //       success: false,
  //     });
  //     return;
  //   }

  //   // find the pool with members less than member limit of the contest-->>
  //   const availablePools = await PoolModel.findOne({
  //     contestId: body.contestId,
  //     matchId: body.matchId,
  //     isClosed: false,
  //     $expr: {
  //       $lt: [
  //         {
  //           $size: "$members",
  //         },
  //         isContest.memberLimit,
  //       ],
  //     },
  //   });

  //   // if no pool is available then create one-->>
  //   if (!availablePools) {
  //     const data = await PoolModel.create({
  //       contestId: body.contestId,
  //       matchId: body.matchId,
  //       members: [userId],
  //     });
  //     console.log({ data });
  //     responseHandler({ res, message: "Contest Joined Successfully", data });
  //     return;
  //   }

  //   // if user has already joined the available pool then create new-->>
  //   if (availablePools && availablePools.members.includes(userId)) {
  //     const data = await PoolModel.create({
  //       contestId: body.contestId,
  //       matchId: body.matchId,
  //       members: [userId],
  //     });
  //     responseHandler({
  //       res,
  //       message: "Contest Joined Successfully",
  //       data: data,
  //     });
  //     return;
  //   }

  //   console.log({ _id: availablePools?._id });
  //   const joinedPoolData = await PoolModel.findByIdAndUpdate(
  //     {
  //       _id: availablePools?._id,
  //     },
  //     {
  //       members: [...availablePools.members, userId],
  //     },
  //     {
  //       new: true,
  //     }
  //   );

  //   responseHandler({
  //     res,
  //     message: "Contest Joined Successfully",
  //     data: joinedPoolData,
  //   });
  // } catch (error) {
  //   internalServerError({ error, req, res });
  // }
};

exports.getPools = async (req, res) => {
  try {
    const matchId = req.query?.matchId;
    const userIdQuery = req.query?.userId;
    const isClosed = req.query?.isClosed;
    const userId = req.userId;
    const userData = await UserModel.findById(userId);
    const page = parseInt(req.query?.pageNo) || 1;
    const limit = parseInt(req.query?.limit) || 10;

    const query = {};

    if (userData.role === ROLES.ADMIN) {
      if (matchId) query.matchId = new mongoose.Types.ObjectId(matchId);
      if (userIdQuery)
        query.members = { $in: [new mongoose.Types.ObjectId(userIdQuery)] };

      const totalPools = await PoolModel.countDocuments(query);
      const poolsData = await PoolModel.aggregate([
        { $match: query },
        { $skip: (page - 1) * limit },
        { $limit: limit },
        {
          $lookup: {
            from: "users",
            localField: "members",
            foreignField: "_id",
            as: "memberDetails",
          },
        },
        {
          $project: {
            // _id: 1,
            // matchId: 1,
            // isClosed: 1,
            // memberDetails: {
            //   name: 1,
            //   _id: 1,
            //   role: 1,
            //   dob: 1,
            //   email: 1,
            //   image: 1,
            //   mobileNo: 1,
            // },
            __v: 0,
            // matchId: 1,
            // isClosed: 1,
            memberDetails: {
              password: 0,
              token: 0,
              otp: 0,
              __v: 0,
              // name: 1,
              // _id: 1,
              // role: 1,
              // dob: 1,
              // email: 1,
              // image: 1,
              // mobileNo: 1,
            },
          },
        },
        {
          $lookup: {
            from: "matches",
            localField: "matchId",
            foreignField: "_id",
            as: "matchData",
          },
        },
        {
          $unwind: "$matchData",
        },
        {
          $project: {
            matchData: { teamOne: 0, teamTwo: 0, __v: 0 },
          },
        },
        {
          $lookup: {
            from: "contests",
            localField: "contestId",
            foreignField: "_id",
            as: "contestData",
          },
        },
        {
          $unwind: "$contestData",
        },
      ]);

      responseHandler({
        res,
        message: "Pools fetched successfully12",
        data: {
          pools: poolsData,
          pagination: {
            total: totalPools,
            page,
            limit,
          },
        },
      });
      return;
    }

    query.members = { $in: [new mongoose.Types.ObjectId(userId)] };
    if (!matchId) {
      responseHandler({
        res,
        message: "Match is required",
        status: 400,
        success: false,
      });
      return;
    }
    if (matchId) query.matchId = new mongoose.Types.ObjectId(matchId);

    const totalPools = await PoolModel.countDocuments(query);
    const poolsData = await PoolModel.aggregate([
      { $match: query },
      { $skip: (page - 1) * limit },
      { $limit: limit },
      {
        $lookup: {
          from: "users",
          localField: "members",
          foreignField: "_id",
          as: "memberDetails",
        },
      },
      // {
      //   $project: {
      //     _id: 1,
      //     matchId: 1,
      //     isClosed: 1,
      //     memberDetails: {
      //       name: 1,
      //       _id: 1,
      //       role: 1,
      //       dob: 1,
      //       email: 1,
      //       image: 1,
      //       mobileNo: 1,
      //     },
      //   },
      // },
      {
        $project: {
          // _id: 1,
          // matchId: 1,
          // isClosed: 1,
          // memberDetails: {
          //   name: 1,
          //   _id: 1,
          //   role: 1,
          //   dob: 1,
          //   email: 1,
          //   image: 1,
          //   mobileNo: 1,
          // },
          __v: 0,
          // matchId: 1,
          // isClosed: 1,
          memberDetails: {
            password: 0,
            token: 0,
            otp: 0,
            __v: 0,
            // name: 1,
            // _id: 1,
            // role: 1,
            // dob: 1,
            // email: 1,
            // image: 1,
            // mobileNo: 1,
          },
        },
      },
      {
        $lookup: {
          from: "matches",
          localField: "matchId",
          foreignField: "_id",
          as: "matchData",
        },
      },
      {
        $unwind: "$matchData",
      },
      {
        $project: {
          matchData: { teamOne: 0, teamTwo: 0, __v: 0 },
        },
      },
      {
        $lookup: {
          from: "contests",
          localField: "contestId",
          foreignField: "_id",
          as: "contestData",
        },
      },
      {
        $unwind: "$contestData",
      },
    ]);

    responseHandler({
      res,
      message: "Pools fetched successfully",
      data: {
        pools: poolsData,
        pagination: {
          total: totalPools,
          page,
          limit,
        },
      },
    });
  } catch (error) {
    internalServerError({ req, res, error });
  }
};
