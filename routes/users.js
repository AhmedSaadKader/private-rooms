var express = require("express");
var router = express.Router();
const usersController = require("../controllers/usersController");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.get("/sign-up", usersController.user_get_newUser);

router.post("/sign-up", usersController.user_post_newUser);

module.exports = router;
