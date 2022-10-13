var express = require("express");
var router = express.Router();
const messageController = require("../controllers/messageController");

/* GET home page. */
router.get("/public", messageController.message_get_public);

router.post("/public", messageController.message_post_public);

module.exports = router;
