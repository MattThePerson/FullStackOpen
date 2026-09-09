const express = require("express");
const app = express();
app.use(express.json());

let persons = [
    {
      "id": "1",
      "name": "Arto Hellas",
      "number": "040-123456"
    },
    {
      "id": "2",
      "name": "Ada Lovelace",
      "number": "39-44-5323523"
    },
    {
      "id": "3",
      "name": "Dan Abramov",
      "number": "12-43-234345"
    },
    {
      "id": "4",
      "name": "Mary Poppendieck",
      "number": "39-23-6423122"
    }
]

function getNewId() {
    return String(Math.floor(Math.random() * Math.pow(2, 32)));
}

app.get("/api/persons", (req, res) => {
    res.json(persons);
})

app.get("/api/persons/:id", (req, res) => {
    const id = req.params.id;
    const person = persons.find(p => p.id === id);
    if (!person) {
        return res.status(404).json({
            error: "no person with that id"
        })
    }
    res.json(person);
})

app.delete("/api/persons/:id", (req, res) => {
    const id = req.params.id;
    persons = persons.filter(p => p.id !== id);
    res.status(204).end();
})

app.post("/api/persons", (req, res) => {
    const body = req.body;
    if (!body.name || !body.number) {
        return res.status(400).json({error: "name or number missing for contact"})
    }
    const personWithName = persons.find(p => p.name === body.name);
    if (personWithName) {
        return res.status(400).json({error: "contact already exists with that name"})
    }
    const person = {
        id: getNewId(),
        name: body.name,
        number: body.number,
    }
    persons = persons.concat(person);
    res.json(person);
})

app.get("/info", (req, res) => {
    const time_fmt = (new Date(Date.now())).toString();
    const msg = `
<div>Phonebook has info for ${persons.length} people</div>
<div>${time_fmt}</div>
`;
    res.send(msg);
})

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});
