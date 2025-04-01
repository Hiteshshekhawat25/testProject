const { joinPool, getPools } = require("../controllers/poolController");
const { authenticateJWT } = require("../validations/authenticateJWT");

const router = require("express").Router();

router.post("/pools/join-pool", authenticateJWT, joinPool);
router.get("/pools", authenticateJWT, getPools);

module.exports = router;
