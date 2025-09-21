const notesRouter = require("express").Router();
const Note = require("../models/note");

notesRouter.get("/", (req, res) => {
  Note.find({}).then((notes) => {
    res.json(notes);
  });
});

notesRouter.get("/:id", (req, res, next) => {
  const id = req.params.id;

  Note.findById(id)
    .then((note) => {
      if (note) {
        res.json(note);
      } else {
        res.status(404).end();
      }
    })
    .catch((e) => next(e));
});

notesRouter.put("/:id", (req, res, next) => {
  const id = req.params.id;
  const body = req.body;

  Note.findByIdAndUpdate(
    id,
    { $set: { important: body.important || false } },
    { new: true, runValidators: true }
  )
    .then((updatedItem) => {
      res.json(updatedItem);
    })
    .catch((e) => next(e));
});

notesRouter.post("/", (req, res, next) => {
  const body = req.body;

  if (!body.content) {
    return res.status(400).json({
      error: "content missing",
    });
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
  });

  note
    .save()
    .then((savedNote) => {
      res.json(savedNote);
    })
    .catch((e) => next(e));
});

notesRouter.delete("/:id", (req, res, next) => {
  const id = req.params.id;
  Note.findByIdAndDelete(id)
    .then(() => {
      res.status(204).json({ message: "Deleted note" });
    })
    .catch((e) => next(e));
});

module.exports = notesRouter;
