const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const confessionSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    comments: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        content: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Confession", confessionSchema);
