const mongoose = require("mongoose");
const tags_schema = new mongoose.Schema(
  {
    tag_name: { type: String },
    note_id: { type: mongoose.Schema.Types.ObjectId, ref: "Notes" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Tags", tags_schema);
