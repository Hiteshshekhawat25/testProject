const { string } = require("joi");
const { default: mongoose } = require("mongoose");

const Contest = mongoose.Schema({
  name: {
    type: String,
    required: false,
    default:null
  },
  entryFee: {
    type: String,
    required: false,
    default:null

  },
  memberLimit: {
    type: Number,
    required: false,
    default: 0,
  },
  isDeleted:{
    type: Boolean,
    required: true,
    default: false,
  },
  isPublished:{
    type: Boolean,
    required: false,
    default: false,
  }

},{
    timestamps:true
});

const ContestModel = new mongoose.model("Contest", Contest);
module.exports = ContestModel;
