const express = require("express");
const { createMatch ,editMatch,deleteMatch,getAllMatches} = require("../controllers/matchController");
const { authenticateJWT } = require("../validations/authenticateJWT");
const { authenticateAdmin } = require("../validations/authenticateAdmin");

const router = express.Router();

router.get("/matches/live-matches");
router.get("/matches/upcoming-matches");

router.post("/matches", authenticateJWT, authenticateAdmin, createMatch);
router.put("/matches", authenticateJWT, authenticateAdmin, editMatch);
router.delete("/matches", authenticateJWT, authenticateAdmin, deleteMatch);
router.get("/matches", authenticateJWT, authenticateAdmin, getAllMatches);

module.exports = router;
