const {
  createPlayer,
  getAllPlayers,
  editPlayer,
  deletePlayer
} = require("../controllers/playerController");
const upload = require("../helpers/multer");
const { authenticateAdmin } = require("../validations/authenticateAdmin");
const { authenticateJWT } = require("../validations/authenticateJWT");
const router = require("express").Router();

router.post(
  "/players",
  authenticateJWT,
  authenticateAdmin,
  upload.single("image"),
  createPlayer
);
router.get("/players", authenticateJWT, authenticateAdmin, getAllPlayers);
router.put("/players", authenticateJWT, authenticateAdmin,upload.single("image"), editPlayer);
router.delete("/players", authenticateJWT, authenticateAdmin, deletePlayer);

module.exports = router;
