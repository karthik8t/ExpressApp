const mongoose = require("mongoose");
const user_obj = {
  username: {
    type: String,
  },
  password: {
    type: String,
  },
};
const user_schema = new mongoose.Schema(user_obj);
module.exports = mongoose.model("NotesUser", user_schema);
