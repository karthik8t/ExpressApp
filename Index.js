// import express and mongoose
// import mongoose from 'mongoose';

const express = require("express");
const mongoose = require("mongoose");

const app = express();
const port = 3001;

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.listen(port, () => {
  console.log(`Express server is listening on port ${port}`);
});
