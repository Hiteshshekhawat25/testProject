const fs = require("node:fs");
const fsPromises = require("fs/promises");

const errorLogger = ({url, error}) => {
  console.log(`Error from:-> ${url}`, error);
};

const internalServerError = ({req, error, res}) => {
  errorLogger({url:req?.url, error});
  
  res.status(500).json({
    message: "Internal Server Error",
    success: false,
    status: 500,
  });
};

const responseHandler = ({
  res,
  status = 200,
  message = "",
  success = true,
  data
}) => {
  
  res.status(status).json({
    message: message,
    status: status,
    success: success,
    data: data,
  });

};

const deleteImg = (imgPath) => {
  fs.unlink(`public/${imgPath}`, (err) => {
    if (err) {
      console.log({ err });
      return;
    }
    console.log("Image delete successfully!", { imgPath });
  });
};

const deleteFile = async (filePath)=>{
  console.log("filePath",filePath);
  try {
    await fsPromises.unlink(filePath);
    console.log('Successfully removed file!');
    
    return true;

  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log('Image file does not exist. Continuing to delete the post.');
      return true;
    } else {
      console.error('Error:', error.message);
      return true;
    }
  }
}

module.exports = {
  errorLogger,
  internalServerError,
  deleteImg,
  responseHandler,
  deleteFile
};
