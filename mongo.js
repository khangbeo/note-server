const mongoose = require("mongoose");

const url =
  "mongodb+srv://fullstack:D0ugd1mmad0m3@cluster0.yr4njon.mongodb.net/testNoteApp?retryWrites=true&w=majority&appName=Cluster0";

mongoose.set("strictQuery", false);

mongoose.connect(url);

// define schema
const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
});

// define collection
const Note = mongoose.model("Note", noteSchema);

// new item
const note = new Note({
  content: "HTML is easy",
  important: true,
});

note.save().then(() => {
  console.log("note saved");
  mongoose.connection.close();
});

// Note.find({}).then((res) => {
//   res.forEach((note) => {
//     console.log(note);
//   });
//   mongoose.connection.close();
// });
