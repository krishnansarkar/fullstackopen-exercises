const express = require("express");
const app = express();
const port = 3001;
app.use(express.json());

let persons = [
    {
        id: "1",
        name: "Arto Hellas",
        number: "040-123456",
    },
    {
        id: "2",
        name: "Ada Lovelace",
        number: "39-44-5323523",
    },
    {
        id: "3",
        name: "Dan Abramov",
        number: "12-43-234345",
    },
    {
        id: "4",
        name: "Mary Poppendieck",
        number: "39-23-6423122",
    },
];

app.get("/info", (request, response) => {
    response.send(
        `<p>Phonebook has info for ${
            persons.length
        } people</p>${new Date()}<p></p>`
    );
});

app.get("/api/persons", (request, response) => {
    response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
    const person = persons.find((person) => person.id == request.params.id);
    if (!person) return response.status(400).end();

    response.json(person);
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

    response.json(newPerson);
});

app.delete("/api/persons/:id", (request, response) => {
    persons = persons.filter((person) => person.id != request.params.id);
    response.status(204).end();
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
