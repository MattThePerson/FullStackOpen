require("dotenv").config();
const express = require('express')
const Note = require("./models/note.js");

/* express */

const app = express()
app.use(express.json()) // use express' json-parser
app.use(express.static("dist"));

// const getNoteId = () => {
//     const id = notes.length == 0
//         ? 0
//         : Math.max(...notes.map(n => Number(n.id)))
//     return String(id+1);
// }

app.get("/", (req, res) => {
    res.send('<h1>Hello World!</h1>');
})

app.get("/api/notes", (req, res) => {
    Note.find({}).then(notes => {
        res.json(notes);
    })
})

app.get("/api/notes/:id", (req, res) => {
  Note.findById(req.params.id).then(note => {
    res.json(note)
  })
})

app.delete("/api/notes/:id", (req, res) => {
    const id = req.params.id;
    notes = notes.filter(note => note.id !== id);
    res.status(204).end();
})

app.post("/api/notes", (req, res) => {
    const body = req.body;
    console.log(body);

    if (!body.content) {
        return res.status(400).json({ error: 'content missing' })
    }

    const note = new Note({
        content: body.content,
        important: body.important || false,
    })

    note.save().then(savedNote => {
        res.json(savedNote)
    })
})

// unknown endpoint (defined after routes)
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

// start
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
