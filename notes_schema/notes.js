const mongoose = require("mongoose");
const notes_schema = new mongoose.Schema(
  {
    owner: { type: String },
    title: { type: String },
    description: { type: String },
    is_favorite: { type: Boolean },
    is_pinned: { type: Boolean },
    tag_name: { type: Array },
    tag_color: { type: String },
    in_trash: { type: Boolean },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Notes", notes_schema);
