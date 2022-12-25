// import express and mongoose
// import mongoose from 'mongoose';

const express = require("express");
const mongoose = require("mongoose");
const notes = require("./notes_schema/notes");

const app = express();
const port = 3001;

// middleware to accept json object
app.use(express.json());

// mongoose connection

mongoose.connect(
  "mongodb+srv://chamber:sage@cluster0.ans8xom.mongodb.net/Notes_v1",
  {
    useNewUrlParser: true,
  }
);

app.listen(port, () => {
  console.log(`Express server is listening on port ${port}`);
});

// default get message to check if express is working

app.get("/", (req, res) => {
  res.send("Hello world");
});

// notes api

const notes_model = require("./notes_schema/notes");
const tags_model = require("./notes_schema/tags");

// add_note
// change_title
// change_description
// update_favorite
// get_favorite_notes
// update_is_pinned
// add_tag_name
// remove_tag_name
// add_tag_color
// remove_tag_color
// update_tag_color
// update_in_trash
// get_notes_by_tag_name
// get_notes_by_tag_color
// get_notes_in_trash

// add_note
app.post("/add_note", async (req, res) => {
  try {
    const new_note = {
      title: "default_title",
      description: "default_description",
      is_favorite: false,
      is_pinned: false,
      tag_name: [],
      tag_color: null,
      in_trash: false,
    };
    new_note.title = req.body.title;
    new_note.description = req.body.description;
    const new_note_model = new notes_model(new_note);
    const note_saved = await new_note_model.save();
    res.send(note_saved);
  } catch {
    console.log("error in post /add_note");
  }
});

// change_title
app.post("/change_title", async (req, res) => {
  console.log(req.body);
  const updated_note = await notes_model.findById(req.body.id);
  updated_note["title"] = req.body.title;
  const updated_note_model = new notes_model(updated_note);
  const note_saved = await updated_note_model.save();
  res.send(note_saved);
});

// change_description
app.post("/change_description", async (req, res) => {
  console.log(req.body);
  const updated_note = await notes_model.findById(req.body.id);
  updated_note["description"] = req.body.description;
  const updated_note_model = new notes_model(updated_note);
  const note_saved = await updated_note_model.save();
  res.send(note_saved);
});

// update_favorite
app.post("/update_favorite", async (req, res) => {
  const updated_note = await notes_model.findById(req.body.id);
  updated_note["is_favorite"] = !updated_note["is_favorite"];
  const updated_note_model = new notes_model(updated_note);
  const note_saved = await updated_note_model.save();
  res.send(note_saved);
});
// get_favorite_notes
app.post("/get_favorite_notes", async (req, res) => {
  const favorite_notes = await notes_model.find({ is_favorite: true });
  res.send(favorite_notes);
});
// update_is_pinned
app.post("/update_is_pinned", async (req, res) => {
  const updated_note = await notes_model.findById(req.body.id);
  updated_note["is_pinned"] = !updated_note["is_pinned"];
  const updated_note_model = new notes_model(updated_note);
  const note_saved = await updated_note_model.save();
  res.send(note_saved);
});
// add_tag_name
app.post("/add_tag_name", async (req, res) => {
  const updated_note = await notes_model.findById(req.body.id);
  updated_note["tag_name"].push(req.body.tag);
  const updated_note_model = new notes_model(updated_note);
  const note_saved = await updated_note_model.save();
  const new_tag_model = new tags_model({
    tag_name: req.body.tag,
    note_id: req.body.id,
  });
  await new_tag_model.save();
  res.send(note_saved);
});
// remove_tag_name
app.post("/remove_tag_name", async (req, res) => {
  const updated_note = await notes_model.findById(req.body.id);
  updated_note["tag_name"] = updated_note["tag_name"].filter((val, index) => {
    if (val == req.body.tag) {
      return false;
    } else {
      return true;
    }
  });
  const updated_note_model = new notes_model(updated_note);
  const note_saved = await updated_note_model.save();
  const deleted_tag_model = await tags_model.find({ tag_name: req.body.tag });
  deleted_tag_model.map(async (val) => {
    await tags_model.findByIdAndDelete(val["_id"]);
  });
  res.send(note_saved);
});

// update_tag_color
app.post("/update_tag_color", async (req, res) => {
  const updated_note = await notes_model.findById(req.body.id);
  updated_note["tag_color"] = req.body.tag_color;
  const updated_note_model = new notes_model(updated_note);
  const note_saved = await updated_note_model.save();
  res.send(note_saved);
});

// remove_tag_color
app.post("/remove_tag_color", async (req, res) => {
  const updated_note = await notes_model.findById(req.body.id);
  updated_note["tag_color"] = null;
  const updated_note_model = new notes_model(updated_note);
  const note_saved = await updated_note_model.save();
  res.send(note_saved);
});

// update_in_trash
app.post("/update_in_trash", async (req, res) => {
  const updated_note = await notes_model.findById(req.body.id);
  updated_note["in_trash"] = !updated_note["in_trash"];
  const updated_note_model = new notes_model(updated_note);
  const note_saved = await updated_note_model.save();
  res.send(note_saved);
});
// get_notes_by_tag_name
app.post("/get_notes_by_tag_name", async (req, res) => {
  const note_ids = await tags_model.find({ tag_name: req.body.tag });
  const notes_by_tag = await get_notes_by_user_id(note_ids);
  console.log("notes_by_tag", notes_by_tag);
  res.send(notes_by_tag);
});

async function get_notes_by_user_id(note_ids) {
  let notes = await Promise.all(
    note_ids.map(async (val, index) => {
      console.log(val["note_id"]);
      var note = await notes_model.findById(val["note_id"]);
      return note;
    })
  );
  console.log(notes);
  return notes;
}

// get_notes_by_tag_color
app.post("/get_notes_by_tag_color", async (req, res) => {
  const notes_by_tag_color = await notes_model.find({
    tag_color: req.body.tag_color,
  });
  res.send(notes_by_tag_color);
});

// get_notes_in_trash
app.post("/get_notes_in_trash", async (req, res) => {
  const notes_by_tag_color = await notes_model.find({
    in_trash: true,
  });
  res.send(notes_by_tag_color);
});
