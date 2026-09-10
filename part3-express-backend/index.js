const express = require('express')
const app = express()

let notes = [
  {
    id: "1",
    content: "HTML is easy",
    important: true
  },
  {
    id: "2",
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: "3",
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  }
]

app.use(express.json()) // use express' json-parser
app.use(express.static("dist"));

const getNoteId = () => {
    const id = notes.length == 0
        ? 0
        : Math.max(...notes.map(n => Number(n.id)))
    return String(id+1);
}

app.get("/", (req, res) => {
    res.send('<h1>Hello World!</h1>');
})

app.get("/api/notes", (req, res) => {
    res.json(notes);
})

app.get("/api/notes/:id", (req, res) => {
    const id = req.params.id;
    const note = notes.find(note => note.id === id);
    if (note) {
        res.json(note);
    } else {
        res.statusMessage = "no note with that id";
        res.status(404).end();
    }
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
        return res.status(400).json({
            error: "content missing",
        })
    }

    const note = {
        content: body.content,
        important: body.important || false,
        id: getNoteId(),
    }

    notes = notes.concat(note);
    res.json(note);
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

// start
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
