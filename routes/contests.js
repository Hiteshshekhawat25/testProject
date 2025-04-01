const {
  createContest,
  editContest,
  deleteContest,
  getAllContest,
} = require("../controllers/contestController");
const { authenticateAdmin } = require("../validations/authenticateAdmin");
const { authenticateJWT } = require("../validations/authenticateJWT");

const router = require("express").Router();

router.get("/contests",authenticateJWT, authenticateAdmin,getAllContest);
router.post("/contests", authenticateJWT, authenticateAdmin, createContest);
router.put("/contests", authenticateJWT, authenticateAdmin, editContest);
router.delete("/contests", authenticateJWT, authenticateAdmin, deleteContest);

module.exports = router;
