const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

messageSchema.virtual("url").get(function () {
  return `/messages/${this._id}`;
});

module.exports = mongoose.model("Message", messageSchema);
