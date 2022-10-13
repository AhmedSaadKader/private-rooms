const { body, validationResult } = require("express-validator");
const async = require("async");

const Message = require("../models/message");
const Club = require("../models/club");
const User = require("../models/user");

exports.message_get_public = (req, res, next) => {
  async.parallel(
    {
      messages(callback) {
        Message.find().exec(callback);
      },
      users(callback) {
        User.find().populate("messages").exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      res.render("public", {
        title: "Clubs",
        path: req.path,
        user: req.user,
        messages: results.messages,
        users: results.users,
      });
    }
  );
};

exports.message_post_public = [
  body("title").trim().isLength({ min: 1 }).escape().withMessage("Message title is required."),
  body("content").trim().isLength({ min: 1 }).escape().withMessage("Message content is required"),
  (req, res, next) => {
    const errors = validationResult(req);
    const message = new Message({
      title: req.body.title,
      content: req.body.content,
    });
    if (!errors.isEmpty()) {
      res.render("public", {
        title: "Clubs",
        message,
        errors: errors.array(),
      });
      return;
    }
    message.save((err, newMessage) => {
      if (err) {
        return next(err);
      }
      User.findOneAndUpdate(req.user._id, { $push: { messages: newMessage._id } }, (err, user) => {
        if (err) {
          return next(err);
        }
        res.redirect("/main/public");
      });
    });
  },
];

exports.message_update_public = (req, res, next) => {};

exports.message_delete_public = (req, res, next) => {};
