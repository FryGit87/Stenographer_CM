// Dependencies
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const express = require("express");
const { readFromFile, writeToFile } = require("./helpers/fsUtils");
const app = express();

// Sets an initial port to use later in our listener
const PORT = process.env.PORT || 3001;

// Sets up the Express app to handle data parsing
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//let notes = [];

//Routes
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.get("/api/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "/db/db.json"));
});

//Wild card
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

//Body content
app.post("/api/notes", (req, res) => {
  const newNote = {
    title: req.body.title,
    text: req.body.text,
    id: uuidv4(),
  };
  //Converting notes to object
  let notes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
  notes.push(newNote);
  fs.writeFileSync("./db/db.json", JSON.stringify(notes, null, 4));
  res.json(notes);
});

app.delete("/api/notes/:id", (req, res) => {
  const tipId = req.params.id;
  readFromFile("./db/db.json")
    .then((data) => JSON.parse(data))
    .then((json) => {
      // Make a new array of all notes except the one with the ID provided in the URL
      const result = json.filter((tip) => tip.id !== tipId);

      // Save that array to the filesystem
      writeToFile("./db/db.json", result);

      // Respond to the DELETE request
      res.json(`Item ${tipId} has been deleted 🗑️`);
    });
});

//Starts the server to start listening at designated PORT
app.listen(PORT, () => {
  console.log("App listening on PORT " + PORT);
});
