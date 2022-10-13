const User = require("../models/user");
const { body, validationResult } = require("express-validator");
const fs = require("fs");
const path = require("path");

exports.user_all_users = (req, res, next) => {
  User.find()
    .sort({ messages: -1 })
    .exec((err, users) => {
      if (err) {
        return next(err);
      }
      res.render("users", {
        title: "All Users",
        users,
        path: req.originalUrl,
        user: req.user,
      });
    });
};

exports.user_detail = (req, res, next) => {
  User.findById(req.params.id)
    .populate({ path: "messages", options: { sort: { createdAt: -1 } } })
    .exec((error, userDetail) => {
      if (error) {
        return next(error);
      }
      if (!userDetail) {
        const err = new Error("User not found");
        err.status = 404;
        return next(err);
      }
      res.render("user_detail", {
        title: `${userDetail.fullName} details`,
        user: req.user,
        path: req.path,
        userDetail,
      });
    });
};

exports.user_get_newUser = (req, res) => {
  res.render("sign-up-form", {
    title: "Sign Up",
    path: req.path,
    user: req.user,
  });
};

exports.user_post_newUser = [
  body("firstName").trim().isLength({ min: 1 }).escape().withMessage("First name must be specified"),
  body("lastName").trim().isLength({ min: 1 }).escape().withMessage("Last name must be specified"),
  body("username")
    .trim()
    .isLength({ min: 1 })
    .isEmail()
    .escape()
    .withMessage("Email must be specified")
    .custom(async (value) => {
      const user = await User.findOne({ username: value });
      if (user) return Promise.reject("Username already in use");
    }),
  body("password").isStrongPassword().withMessage("Password is not strong enough"),
  body("passwordConfirmation").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Password confirmation does not match password");
    }
    return true;
  }),
  (req, res, next) => {
    const errors = validationResult(req);
    const user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      username: req.body.username,
      password: req.body.password,
      membership: req.body.membership,
      image: req.file
        ? {
            data: fs.readFileSync(path.join(__dirname, "..", "uploads", req.file.filename)),
            contentType: "image/png",
          }
        : null,
    });
    if (!errors.isEmpty()) {
      res.render("sign-up-form", {
        title: "Sign Up",
        user: user,
        errors: errors.array(),
        path: req.path,
      });
      return;
    }
    user.save((err) => {
      if (err) {
        return next(err);
      }
      req.login(user, function (err) {
        res.redirect("/");
        if (err) {
          return next(err);
        }
      });
    });
  },
];

exports.user_get_logIn = (req, res) => {
  res.render("log-in", {
    title: "Log In",
    path: req.path,
    user: req.user,
  });
};

exports.user_logout = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};

exports.user_update_get = (req, res, next) => {
  User.findById(req.params.id).exec((error, userDetail) => {
    if (error) {
      return next(error);
    }
    if (!userDetail) {
      const error = new Error("User not found");
      error.status = 404;
      return next(error);
    }
    console.log(userDetail._id.toString(), req.params.id);
    res.render("sign-up-form", {
      title: `Update ${userDetail.fullName}`,
      user: req.user,
      userId: req.params.id,
      path: req.path,
      userDetail,
    });
  });
};

// exports.user_update_post = [
//   body("firstName").trim().isLength({ min: 1 }).escape().withMessage("First name must be specified"),
//   body("lastName").trim().isLength({ min: 1 }).escape().withMessage("Last name must be specified"),
//   (req, res, next) => {
//     const errors = validationResult(req);
//     const userFields = {
//       firstName: req.body.firstName,
//       lastName: req.body.lastName,
//       image: req.file
//         ? {
//             data: fs.readFileSync(path.join(__dirname, "..", "uploads", req.file.filename)),
//             contentType: "image/png",
//           }
//         : null,
//     };
//     if (!errors.isEmpty()) {
//       console.log(userFields);
//       console.log(req.body);
//       User.findById(req.params.id, (err, userDetail) => {
//         if (err) {
//           return next(err);
//         }
//         res.render("sign-up-form", {
//           title: `Update ${userDetail.fullName}`,
//           user: req.user,
//           userId: req.params.id,
//           path: req.path,
//           userDetail,
//           errors: errors.array(),
//         });
//       });
//       return;
//     }
//     User.findByIdAndUpdate(req.params.id, { $set: { ...userFields } }, {}, (err, updatedUser) => {
//       if (err) {
//         return next(err);
//       }
//       redirect(updatedUser.url);
//     });
//   },
// ];

exports.user_update_post = [
  body("firstName").trim().isLength({ min: 1 }).escape().withMessage("First name must be specified"),
  body("lastName").trim().isLength({ min: 1 }).escape().withMessage("Last name must be specified"),
  body("username")
    .trim()
    .isLength({ min: 1 })
    .isEmail()
    .escape()
    .withMessage("Email must be specified")
    .custom(async (value) => {
      const user = await User.findOne({ username: value });
      if (user) return Promise.reject("Username already in use");
    }),
  body("password").isStrongPassword().withMessage("Password is not strong enough"),
  body("passwordConfirmation").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Password confirmation does not match password");
    }
    return true;
  }),
  (req, res, next) => {
    const errors = validationResult(req);
    const user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      username: req.body.username,
      password: req.body.password,
      membership: req.body.membership,
      image: req.file
        ? {
            data: fs.readFileSync(path.join(__dirname, "..", "uploads", req.file.filename)),
            contentType: "image/png",
          }
        : null,
      _id: req.params.id,
    });
    if (!errors.isEmpty()) {
      res.render("sign-up-form", {
        title: "Sign Up",
        user: req.user,
        userDetail: user,
        userId: req.params.id,
        errors: errors.array(),
        path: req.path,
      });
      return;
    }
    User.findByIdAndRemove(req.params.id, user, {}, (err, updatedUser) => {
      if (err) {
        return next(err);
      }
      res.redirect(updatedUser.url);
    });
  },
];
