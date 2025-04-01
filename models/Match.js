const mongoose = require("mongoose");
const { MatchStatus } = require("../constants");

const teamSchema = new mongoose.Schema({
    teamId: {
      type: mongoose.Types.ObjectId, 
      ref: 'Team',
      required: false,
      default:null
    },
    roster: {
      type: [mongoose.Types.ObjectId], 
      default: [],
      ref: 'Player',
      require:false,
    },
    squad: {
      type: [mongoose.Types.ObjectId], 
      default: [],
      ref: 'Player',
      require:false,

    },

  });

const Match = mongoose.Schema(
  {
    matchName: {
      type: String,
      required: true,
      default: null,
    },
    // teamOneId: {
    //   type: mongoose.Types.ObjectId,
    //   required: true,
    //   default: null,
    //   ref: "Teams",
    // },
    // teamTwoId: {
    //   type: mongoose.Types.ObjectId,
    //   required: true,
    //   default: null,
    //   ref: "Teams",
    // },
    teamOne: {
      type: teamSchema,
      require: true,
    },
    teamTwo: {
      type: teamSchema,
      require: true,
    },
    status: {
      type: String,
      require: true,
      default: MatchStatus?.SCHEDULE,
      enum: [MatchStatus?.SCHEDULE, MatchStatus?.LIVE, MatchStatus.ENDED],
    },
    tournamentName: {
      type: String,
      require: true,
    },
    startTime: {
      type: Date,
      required: [true, "Start time is required"],
      validate: {
        validator: (value) => value instanceof Date && !isNaN(value),
        message: "Invalid date format",
      },
    },
    isDeleted:{
      type: Boolean,
      required: true,
      default:false
    }
  },
  {
    timestamps: true,
  }
);

const MatchModel = new mongoose.model("Match", Match);
module.exports = MatchModel;
