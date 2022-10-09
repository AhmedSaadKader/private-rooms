const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  membership: { type: String, enum: ["Admin", "User"], required: true },
  messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
  rooms: [{ type: Schema.Types.ObjectId, ref: "Room" }],
});

module.exports = mongoose.model("User", userSchema);
