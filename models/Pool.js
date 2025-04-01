const { default: mongoose } = require("mongoose");

const Pool = mongoose.Schema(
  {
    members: {
      type: [mongoose.Types.ObjectId],
      // type: [
      //   {
      //     teamId: {
      //       type: mongoose.Types.ObjectId,
      //       required: false,
      //       default: null,
      //     },
      //     userId: {
      //       type: mongoose.Types.ObjectId,
      //       required: false,
      //       default: null,
      //     },
      //   },
      // ],
      required: false,
      default: [],
    },

    isDeleted: {
      type: Boolean,
      required: true,
      default: false,
    },
    contestId: {
      type: mongoose.Types.ObjectId,
      required: false,
      default: null,
      ref: "Contests",
    },
    matchId: {
      type: mongoose.Types.ObjectId,
      required: false,
      default: null,
      ref: "Matches",
    },
    isClosed: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const PoolModel = new mongoose.model("Pool", Pool);
module.exports = PoolModel;
