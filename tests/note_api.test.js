const { test, after } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");

const api = supertest(app);

test("all notes are returned", async () => {
  const response = await api.get("/api/notes");

  assert.strictEqual(response.body.length, 3);
});

test("a specific note is within the returned notes", async () => {
  const res = await api.get("/api/notes");

  const contents = res.body.map((e) => e.content);
  assert.strictEqual(contents.includes("HTML is easy"), true);
});

after(async () => {
  await mongoose.connection.close();
});
