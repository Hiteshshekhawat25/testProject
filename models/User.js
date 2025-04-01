const mongoose = require("mongoose");
const { ROLES } = require("../constants");

const User = mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
      default:null
    },
    mobileNo: {
      type: String,
      required: false,
      default:null
    },
    dob: {
      type: String,
      required: false,
      default:null
    },
    token: {
      type: String,
      required: false,
      default:null
    },
    image: {
      type: String,
      required: false,
      default:null
    },
    role: {
      type: String,
      required: false,
      default:ROLES.USER
    },
    otp: {
      type: String,
      required: false,
      default:null
    },
    walletBalance:{
      type:Number,
      required:false,
      default:null,
    },
    bonusBalance:{
      type:Number,
      required:false,
      default:null,
    },
    email:{
      type:String,
      required:false,
      default:null,
    },
    password:{
      type:String,
      required:false,
      default:null,
    }
  },
  {
    timestamps: true,
  }
);

const UserModel = new mongoose.model("User", User);
module.exports = UserModel;
