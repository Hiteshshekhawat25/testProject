const ContestModel = require("../models/Contest");
const DuoModel = require("../models/Duo");
const MatchModel = require("../models/Match");
const PoolModel = require("../models/Pool");

// socket.emit("join-pool", {userId}, (res) => {
//     console.log({res});
// })
module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log(`A user Connected:${socket.id}`);

    // join pool


    // socket.on('join-room',(data)=>{
    //   console.log("room join")
    //   socket.join(data.roomName)
    //   console.log(io.sockets.adapter.rooms,"sssssssssssssss")
    // })
    socket.on("join-pool", async (data, cb) => {
      const body = data;
      const userId = data?.userId;

      const isContest = await ContestModel.findById(body.contestId);
      if (!isContest) {
        //checking if contest exists -->>
        socket.emit("poolJoined", {
          message: "Contest doesn't exists",
          status: 400,
          success: false,
        });
        // cb({
        //   message: "Contest doesn't exists",
        //   status: 400,
        //   success: false,
        // });
        return;
      }
      const isMatch = await MatchModel.findById(body.matchId);
      if (!isMatch) {
        //checking if match exists -->>>
        socket.emit("poolJoined", {
          message: "Match doesn't exists",
          status: 400,
          success: false,
        });
        // cb({
        //   message: "Match doesn't exists",
        //   status: 400,
        //   success: false,
        // });
        return;
      }

      const isDuo = await DuoModel.findById(body.duoId);
      if (!isDuo) {
        //checking if match exists -->>>
        socket.emit("poolJoined", {
          message: "Duo doesn't exists",
          status: 400,
          success: false,
        });
        // cb({
        //   message: "Match doesn't exists",
        //   status: 400,
        //   success: false,
        // });
        return;
      }
      // find the pool with members less than member limit of the contest-->>
      const availablePools = await PoolModel.findOne({
        contestId: body.contestId,
        matchId: body.matchId,
        isClosed: false,
        $expr: {
          $lt: [
            {
              $size: "$members",
            },
            isContest.memberLimit,
          ],
        },
      });

      // if no pool is available then create one-->>
      if (!availablePools) {
        const data = await PoolModel.create({
          contestId: body.contestId,
          matchId: body.matchId,
          members: [userId],
        });

        const updatedDuo = await DuoModel.findByIdAndUpdate(
          { _id: body.duoId },
          {
            $addToSet: {
              pools: data._id,
            },
          }
        );

        // socket.join(data?._id)
        socket.join(data._id)
        console.log(io.sockets.adapter.rooms,"sssssssssssssss")
        socket.to(data?._id).emit("poolJoined", {
          message: "Contest Joined Successfully",
          success: true,
          data,
          updatedDuo,
        });
        socket.emit("pool",{message:"you joined pool"})
        // cb({
        //   message: "Contest Joined Successfully",
        //   success: true,
        //   data,
        //   updatedDuo,
        // });
        return;
      }

      // if user has already joined the available pool then create new-->>
      if (availablePools && availablePools.members.includes(userId)) {
        const data = await PoolModel.create({
          contestId: body.contestId,
          matchId: body.matchId,
          members: [userId],
        });
        const updatedDuo = await DuoModel.findByIdAndUpdate(
          { _id: body.duoId },
          {
            $addToSet: {
              pools: data._id,
            },
          }
        );
        socket.to(data?._id).emit("poolJoined", {
          message: "Contest Joined Successfully",
          success: true,
          data,
          updatedDuo,
        });
        // cb({
        //   message: "Contest Joined Successfully",
        //   success: true,
        //   data,
        //   updatedDuo,
        // });
        return;
      }

      // console.log({ _id: availablePools?._id });
      // update the pool to join a new member
      const joinedPoolData = await PoolModel.findByIdAndUpdate(
        {
          _id: availablePools?._id,
        },
        {
          members: [...availablePools.members, userId],
        },
        {
          new: true,
        }
      );
      const updatedDuo = await DuoModel.findByIdAndUpdate(
        { _id: body.duoId },
        {
          $addToSet: {
            pools: joinedPoolData._id,
          },
        }
      );


      socket.join(joinedPoolData._id)
      console.log(io.sockets.adapter.rooms,"testttttt")
      socket.to(joinedPoolData?._id).emit("poolJoined", {
        message: "Contest Joined Successfully"
      });
      socket.emit("pool",{message:"you joined pool"})
      // cb({
      //   message: "Contest Joined Successfully",
      //   success: true,
      //   data: joinedPoolData,
      //   updatedDuo,
      // });
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};
