const User = require("../models/user");
const { body, validationResult } = require("express-validator");

exports.user_get_newUser = (req, res) => {
  res.render("sign-up-form", {
    title: "Sign Up",
    membership: User.schema.path("membership").options.enum,
  });
};

exports.user_post_newUser = [
  body("firstName").trim().isLength({ min: 1 }).escape().withMessage("First name must be specified"),
  body("lastName").trim().isLength({ min: 1 }).escape().withMessage("Last name must be specified"),
  body("username").trim().isLength({ min: 1 }).isEmail().escape().withMessage("Email must be specified"),
  body("password").isStrongPassword().withMessage("Password is not strong enough"),
  body("membership").escape(),
  (req, res, next) => {
    console.log(req.body);
    const errors = validationResult(req);
    const user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      username: req.body.username,
      password: req.body.password,
      membership: req.body.membership,
    });
    console.log(user.membership);
    if (!errors.isEmpty()) {
      res.render("sign-up-form", {
        title: "Sign Up",
        membership: User.schema.path("membership").options.enum,
        user: user,
        errors: errors.array(),
      });
      return;
    }
    user.save((err) => {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
  },
];
