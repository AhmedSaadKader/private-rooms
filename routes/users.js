var express = require("express");
const passport = require("passport");
var router = express.Router();
const usersController = require("../controllers/usersController");
const multer = require("multer");
const User = require("../models/user");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.filename + "-" + Date.now());
  },
});

const upload = multer({ storage });

const authMiddleware = (req, res, next) => {
  const reject = () => {
    res.setHeader("www-authenticate", "Basic");
    res.sendStatus(401);
  };
  const authorization = req.headers.authorization;

  if (!authorization) {
    return reject();
  }

  const [username, password] = Buffer.from(authorization.replace("Basic ", ""), "base64").toString().split(":");

  if (!(username === "admin" && password === "asa")) {
    return reject();
  }

  next();
};

/* GET users listing. */
router.get("/", usersController.user_all_users);

router.get("/user-detail/:id", usersController.user_detail);

router.get("/sign-up", usersController.user_get_newUser);

router.post("/sign-up", upload.single("image"), usersController.user_post_newUser);

router.get("/log-in", usersController.user_get_logIn);

router.post(
  "/log-in",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/",
  })
);

router.get("/log-out", usersController.user_logout);

router.get("/update/:id", usersController.user_update_get);

router.post("/update/:id", usersController.user_update_post);

module.exports = router;
