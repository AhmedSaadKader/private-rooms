const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  image: {
    data: Buffer,
    contentType: String,
  },
  messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
  clubs: [{ type: Schema.Types.ObjectId, ref: "Club" }],
});

userSchema.virtual("url").get(function () {
  return `/users/user-detail/${this._id}`;
});
userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

module.exports = mongoose.model("User", userSchema);
