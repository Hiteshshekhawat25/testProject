const validator =
  (joiSchema, validateOn = "body") =>
  (req, res, next) => {
    const check = joiSchema.validate(req[validateOn]);
    // console.log("-->>>", req);

    if (check?.error) {
      res.status(400).json({
        success: false,
        message: check?.error?.message,
        status: 400,
      });
    } else {
      next();
    }
  };

module.exports = validator;
