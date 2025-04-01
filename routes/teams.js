const express = require("express");
const { authenticateJWT } = require("../validations/authenticateJWT");
const { createTeam, getAllTeams ,editTeam,deleteTeam} = require("../controllers/teamsController");
const upload = require("../helpers/multer");
const { authenticateAdmin } = require("../validations/authenticateAdmin");

const router = express.Router();

router.post(
  "/teams",
  authenticateJWT,
  authenticateAdmin,
  upload.single("icon"),
  createTeam
);
//for admin only
router.get("/teams", authenticateJWT, authenticateAdmin, getAllTeams);
router.put("/teams", authenticateJWT, authenticateAdmin,upload.single("icon"), editTeam);
router.delete("/teams", authenticateJWT, authenticateAdmin, deleteTeam);

module.exports = router;
