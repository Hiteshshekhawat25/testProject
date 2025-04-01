const  mongoose = require("mongoose");

const DB_URL = process.env.MONGODB_URL;
// const DB_URL = 'mongodb://127.0.0.1:27017/cric-app'
mongoose.connect(DB_URL,{ serverSelectionTimeoutMS:30000 }).then(()=>console.log('DB connected successfully!')).catch(err=>console.log('DB connection failed!'));
