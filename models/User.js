const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  confessions: [
    {
      postId: {
        type: Schema.Types.ObjectId,
        ref: "Confession",
        required: false,
      },
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
