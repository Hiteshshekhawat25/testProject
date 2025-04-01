const { default: mongoose } = require("mongoose");
const { playerTypes, bowlerEnum, battingEnum } = require("../constants");

const Player = mongoose.Schema({
  name: {
    type: String,
    required: false,
    default:null
  },
  image: {
    type: String,
    required: false,
    default:null
  },
  playerType: {
    type: String,
    required: false,
    enum: Object.values(playerTypes),
    default: null,
  },
  bowling: {
    type: String,
    required: false,
    default: null,
    enum: Object.values(bowlerEnum),
  },
  batting: {
    type: String,
    required: false,
    default: null,
    enum: Object.values(battingEnum),
  },
  teamId: {
    type: mongoose.Types.ObjectId,
    required: false,
    ref: "Teams",
    default:null
  },
  isDeleted:{
    type: Boolean,
    required: true,
    default:false
  }

});

const PlayerModel = new mongoose.model("Player", Player);
module.exports = PlayerModel;
