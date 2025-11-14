require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const Person = require("./models/person");
const port = process.env.PORT;

app.use(express.static("dist"));
app.use(express.json());

morgan.token("body", (request, response) => JSON.stringify(request.body));
app.use(
    morgan(
        ":method :url :status :res[content-length] - :response-time ms :body"
    )
);

app.get("/info", (request, response) => {
    Person.countDocuments({}).then((count) => {
        return response.send(
            `<p>Phonebook has info for ${count} people</p><p>${new Date()}</p>`
        );
    });
});

app.get("/api/persons", (request, response) => {
    Person.find({}).then((persons) => {
        return response.json(persons);
    });
});

app.get("/api/persons/:id", (request, response) => {
    Person.findById(request.params.id)
        .then((person) => {
            if (!person) return response.status(400).end();
            return response.json(person);
        })
        .catch((error) => {
            console.log("error fetching from MongoDB", error.message);
            return response.status(400).end();
        });
});

app.post("/api/persons", (request, response) => {
    const person = request.body;

    if (!person.name)
        return response.status(400).json({
            error: "name missing",
        });
    if (!person.number)
        return response.status(400).json({
            error: "number missing",
        });
    if (persons.find((p) => p.name.toLowerCase() == person.name.toLowerCase()))
        return response.status(400).json({
            error: "name must be unique",
        });

    const newPerson = {
        id: String(Math.floor(Math.random() * 9999999999)),
        name: person.name,
        number: person.number,
    };

    persons = persons.concat(newPerson);

    return response.json(newPerson);
});

app.delete("/api/persons/:id", (request, response) => {
    persons = persons.filter((person) => person.id != request.params.id);
    return response.status(204).end();
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
