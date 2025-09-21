const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const config = require("./utils/config");
const logger = require("./utils/logger");
const middleware = require("./utils/middleware");
const notesRouter = require("./controllers/note");

const url = config.MONGODB_URI;

const app = express();

logger.info("connecting to", url);

mongoose
  .connect(url)
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((error) => {
    logger.error("error connecting to MongoDB:", error.message);
  });

morgan.token("data", (req) => {
  return JSON.stringify(req.body);
});

app.use(express.static("dist"));
app.use(express.json());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :data")
);
// app.use(middleware.requestLogger);

app.use("/api/notes", notesRouter);
// let notes = [
//   {
//     id: "1",
//     content: "HTML is easy",
//     important: true,
//   },
//   {
//     id: "2",
//     content: "Browser can execute only JavaScript",
//     important: false,
//   },
//   {
//     id: "3",
//     content: "GET and POST are the most important methods of HTTP protocol",
//     important: true,
//   },
// ];

// app.get("/", (req, res) => {
//   res.send("<h1>Hello world!</h1>");
// });

// app.get("/api/notes", (req, res) => {
//   Note.find({}).then((notes) => {
//     res.json(notes);
//   });
// });

// app.get("/api/notes/:id", (req, res, next) => {
//   const id = req.params.id;

//   Note.findById(id)
//     .then((note) => {
//       if (note) {
//         res.json(note);
//       } else {
//         res.status(404).end();
//       }
//     })
//     .catch((error) => next(error));
//   // const note = notes.find((n) => n.id === id);
//   // if (note) {
//   //   res.json(note);
//   // } else {
//   //   res.status(404).end();
//   // }
// });

// app.put("/api/notes/:id", (req, res, next) => {
//   const id = req.params.id;
//   const body = req.body;

//   Note.findByIdAndUpdate(
//     id,
//     { $set: { important: body.important || false } },
//     { new: true, runValidators: true }
//   )
//     .then((updatedItem) => {
//       if (updatedItem) {
//         res.json(updatedItem);
//       } else {
//         res.status(404).json({ error: "Note not found" });
//       }
//     })
//     .catch((e) => next(e));

//   // USING findById
//   // Note.findById(id)
//   //   .then(note => {
//   //     if (!note) {
//   //       return res.status(404).end()
//   //     }

//   //     note.content = body.content
//   //     note.important = body.important

//   //     return note.save().then((updatedNote) => {
//   //       res.json(updatedNote)
//   //     })
//   //   }).catch(e => next(e))

//   // const index = notes.findIndex((n) => n.id === id);

//   // if (index === -1) {
//   //   return res.status(404).json({ error: "Note not found" });
//   // }

//   // notes[index] = { ...notes[index], ...body };

//   // res.json(notes[index]);
// });

// app.delete("/api/notes/:id", (req, res, next) => {
//   const id = req.params.id;
//   Note.findByIdAndDelete(id)
//     .then((note) => {
//       if (note) {
//         res.status(204).json({ message: "Deleted note" });
//       } else {
//         res.status(404).json({ error: "Not not found" });
//       }
//     })
//     .catch((e) => next(e));

//   // notes.filter((n) => n.id !== id);
// });

// // const generateId = () => {
// //   const maxId =
// //     notes.length > 0 ? Math.max(...notes.map((n) => Number(n.id))) : 0;
// //   return String(maxId + 1);
// // };

// app.post("/api/notes", (req, res, next) => {
//   const body = req.body;

//   if (!body.content) {
//     return res.status(400).json({
//       error: "content missing",
//     });
//   }

//   const note = new Note({
//     content: body.content,
//     important: body.important || false,
//   });

//   note
//     .save()
//     .then((savedNote) => {
//       res.json(savedNote);
//     })
//     .catch((e) => next(e));
// });

// handler of requests with unknown endpoint
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
