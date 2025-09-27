const notesRouter = require("express").Router();
const Note = require("../models/note");

notesRouter.get("/", async (req, res) => {
  const notes = await Note.find({});
  res.json(notes);
});

notesRouter.get("/:id", async (req, res, next) => {
  const id = req.params.id;

  const foundNote = await Note.findById(id);
  if (foundNote) {
    res.json(foundNote);
  } else {
    res.status(404).end();
  }
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

notesRouter.post("/", async (req, res) => {
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

  const savedNote = await note.save();
  res.status(201).json(savedNote);
});

notesRouter.delete("/:id", async (req, res, next) => {
  const id = req.params.id;
  await Note.findByIdAndDelete(id);
  res.status(204).json({ message: "Deleted note" });
});

module.exports = notesRouter;
