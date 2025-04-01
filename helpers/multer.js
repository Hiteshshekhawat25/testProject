const multer = require("multer");

const storage = multer.diskStorage({
  destination: "./public",
  filename: (req, file, cb) => {
    console.log("filefile", { file });
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExt = file.originalname.split(".").pop();
    cb(null, file.fieldname + "-" + uniqueSuffix + "." + fileExt);
  },
});

const upload = multer({ storage: storage });
module.exports = upload;
