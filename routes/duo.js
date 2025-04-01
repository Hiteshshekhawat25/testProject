const { createDuo, editDuo, deleteDuo, getAllDuo } = require("../controllers/duoController");
const { authenticateJWT } = require("../validations/authenticateJWT");

const router = require("express").Router();

router.post("/duo", authenticateJWT, createDuo);
router.put("/duo", authenticateJWT, editDuo);
router.delete("/duo", authenticateJWT, deleteDuo);
router.get("/duo", authenticateJWT, getAllDuo);

module.exports = router;
