require("dotenv").config();
const express = require("express");
const morgan = require("morgan"); // express middleware
const Person = require("./modules/person");

const app = express();

/* MIDDLEWARE */

app.use(express.static("dist")); // serve frontend statically
app.use(express.json()); // allow accepting json in post requests

// log requests to console using morgan
app.use(morgan((tokens, req, res) => {
    const msg = [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, "content-length"), "-",
        tokens["response-time"](req, res), "ms",
    ];
    if (tokens.method(req, res) === "POST") {
        msg.push(JSON.stringify(req.body));
    }
    return msg.join(" ");
}));

/* ROUTES */

app.get("/api/persons", (req, res) => {
    Person.find({}).then(persons => {
        res.json(persons);
    });
});

app.get("/api/persons/:id", (req, res, next) => {
    const id = req.params.id;
    Person.findById(id)
        .then(person => {
            if (!person) {
                return res.status(404).json({ error: "no person with that id" });
            }
            res.json(person);
        })
        .catch(err => next(err));
});

app.delete("/api/persons/:id", (req, res, next) => {
    const id = req.params.id;
    Person.findByIdAndDelete(id)
        .then(() => {
            res.status(204).end();
        })
        .catch(err => next(err));
});

app.post("/api/persons", async (req, res, next) => {
    const body = req.body;
    if (!body.name || !body.number) {
        return res.status(400).json({ error: "name or number missing for contact" });
    }
    // check for existing person
    const personWithName = await Person.find({ name: body.name });
    if (personWithName.length > 0) {
        return res.status(400).json({ error: "contact already exists with that name" });
    }
    // add new person
    const person = new Person({
        name: body.name,
        number: body.number,
    });
    person.save()
        .then(result => {
            res.json(result);
        })
        .catch(err => next(err));
});

app.put("/api/persons/:id", (req, res, next) => {
    const id = req.params.id;
    const { name, number } = req.body;
    Person.findById(id)
        .then(person => {
            if (!person) {
                return res.status(404).json({ error: "no person with that id" });
            }
            person.name = name;
            person.number = number;
            person.save().then(updatedPerson => {
                res.json(updatedPerson);
            });
        })
        .catch(err => next(err));
});

app.get("/info", async (req, res) => {
    const time_fmt = (new Date(Date.now())).toString();
    const persons = await Person.find({});
    const msg = `
<div>Phonebook has info for ${persons.length} people</div>
<div>${time_fmt}</div>
`;
    res.send(msg);
});

// unknown endpoint
const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: "unknown endpoint" });
};
app.use(unknownEndpoint);

// error handling middleware
const errHandler = (err, req, res, next) => {
    console.log(err.message);
    if (err.name === "CastError") {
        return res.status(400).send({ error: "malformatted id" });
    }
    if (err.name === "ValidationError") {
        return res.status(400).send({ error: err.message });
    }
    next(err);
};
app.use(errHandler);

/* START */

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});
