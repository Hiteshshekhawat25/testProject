const { default: mongoose } = require("mongoose");

const Duo = mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
      default: null,
    },
    batterId: {
      type: mongoose.Types.ObjectId,
      required: false,
      default: null,
    },
    bowlerId: {
      type: mongoose.Types.ObjectId,
      required: false,
      default: null,
    },
    isPrimary: {
      type: Boolean,
      required: false,
      default: null,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      required: false,
      default: null,
    },
    matchId: {
      type: mongoose.Types.ObjectId,
      required: false,
      default: null,
    },
    isDeleted: {
      type: Boolean,
      required: true,
      default: false,
    },
    pools: {
      type: [mongoose.Types.ObjectId],
      required: false,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const DuoModel = new mongoose.model("Duo", Duo);
module.exports = DuoModel;
