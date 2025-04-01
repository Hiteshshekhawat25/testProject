const { default: mongoose } = require("mongoose");


const Team = mongoose.Schema({
  teamName: {
    type: String,
    required: false,
    default:null
  },
  icon: {
    type: String,
    required: false,
    default:null
  },
  abbreviation: {
    type: String,
    required: false,
    default:null
  },
  isDeleted:{
    type: Boolean,
    // required: false,
    required: true,
    default:false
  }
//   rooster:{
//     type: [mongoose.Types.ObjectId],
//     required: true,
//   },
//   squad:{
//     type: [mongoose.Types.ObjectId],
//     required: true,
//   }
  
},{
    timestamps:true
});

const TeamModel=  new mongoose.model("Team", Team);
module.exports = TeamModel;
