require("dotenv").config();
const express = require("express");
const morgan = require("morgan"); // express middleware
const Person = require("./modules/person");

const app = express();

/* MIDDLEWARE */

app.use(express.json()); // allow accepting json in post requests

// log requests to console using morgan
app.use(morgan((tokens, req, res) => {
    const msg = [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
    ]
    if (tokens.method(req, res) === "POST") {
        msg.push(JSON.stringify(req.body))
    }
    return msg.join(" ")
}));

app.use(express.static("dist")); // serve frontend statically

/* ROUTES */

app.get("/api/persons", (req, res) => {
    Person.find({}).then(persons => {
        res.json(persons);
    })
})

app.get("/api/persons/:id", (req, res) => {
    const id = req.params.id;
    Person.findById(id).then(person => {
        if (!person) {
            return res.status(404).json({ error: "no person with that id" });
        }
        res.json(person);
    })
})

// TODO: fix
app.delete("/api/persons/:id", (req, res) => {
    res.status(501).end();
    // const id = req.params.id;
    // persons = persons.filter(p => p.id !== id);
    // res.status(204).end();
})

app.post("/api/persons", async (req, res) => {
    const body = req.body;
    if (!body.name || !body.number) {
        return res.status(400).json({ error: "name or number missing for contact" })
    }
    // check for existing person
    const personWithName = await Person.find({ name: body.name });
    if (personWithName.length > 0) {
        return res.status(400).json({error: "contact already exists with that name"})
    }
    // add new person
    const person = new Person({
        name: body.name,
        number: body.number,
    })
    person.save().then(result => {
        res.json(result);
    })
})

app.get("/info", async (req, res) => {
    const time_fmt = (new Date(Date.now())).toString();
    const persons = await Person.find({});
    const msg = `
<div>Phonebook has info for ${persons.length} people</div>
<div>${time_fmt}</div>
`;
    res.send(msg);
})

/* START */

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});
