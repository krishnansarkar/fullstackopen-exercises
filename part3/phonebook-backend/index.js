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

app.get("/api/persons/:id", (request, response, next) => {
    Person.findById(request.params.id)
        .then((person) => {
            if (!person) return response.status(404).end();
            return response.json(person);
        })
        .catch((error) => {
            console.log("error fetching from MongoDB", error.message);
            return next(error);
        });
});

app.post("/api/persons", (request, response, next) => {
    const person = request.body;

    if (!person.name) {
        const error = new Error("name missing");
        error.name = "FieldError";
        return next(error);
    }
    if (!person.number) {
        const error = new Error("number missing");
        error.name = "FieldError";
        return next(error);
    }
    // if (persons.find((p) => p.name.toLowerCase() == person.name.toLowerCase()))
    //     return response.status(400).json({
    //         error: "name must be unique",
    //     });

    const newPerson = new Person({
        name: person.name,
        number: person.number,
    });
    newPerson
        .save()
        .then((result) => {
            return response.json(result);
        })
        .catch((error) => {
            console.log("error posting to MongoDB: ", error.message);
            return next(error);
        });
});

app.delete("/api/persons/:id", (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
        .then((person) => {
            response.status(204).end();
        })
        .catch((error) => {
            console.log("error deleting from MongoDB: ", error.message);
            return next(error);
        });
});

const errorHandler = (error, request, response, next) => {
    switch (error.name) {
        case "CastError":
            return response.status(400).send({ message: "malformatted id" });
        case "FieldError":
            return response.status(400).send({ message: error.message });
    }

    next(error);
};

app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
