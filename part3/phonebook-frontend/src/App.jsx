import { useState, useEffect } from "react";
import personsService from "./services/persons";

const Notification = ({ message }) => {
    if (message == null) return;
    const notificationStyle = {
        color: "red",
        background: "lightgrey",
        fontSize: "20px",
        borderStyle: "solid",
        borderRadius: "5px",
        padding: "10px",
        marginBottom: "10px",
    };
    return <div style={notificationStyle}>{message}</div>;
};

const Filter = ({ searchQuery, onChange }) => (
    <div>
        filter shown with <input value={searchQuery} onChange={onChange} />
    </div>
);

const PersonForm = ({
    onSubmit,
    name,
    number,
    onNameChange,
    onNumberChange,
}) => (
    <form onSubmit={onSubmit}>
        <div>
            name: <input value={name} onChange={onNameChange} />
        </div>
        <div>
            number: <input value={number} onChange={onNumberChange} />
        </div>
        <div>
            <button type="submit">add</button>
        </div>
    </form>
);

const Person = ({ name, number, id, onDelete }) => (
    <p>
        {name} {number} <button onClick={() => onDelete(id)}>Delete</button>
    </p>
);

const Persons = ({ persons, onDelete }) => (
    <div>
        {persons.map((person) => (
            <Person
                key={person.id}
                name={person.name}
                number={person.number}
                id={person.id}
                onDelete={onDelete}
            />
        ))}
    </div>
);

const App = () => {
    const [persons, setPersons] = useState([]);
    const [newName, setNewName] = useState("");
    const [newNumber, setNewNumber] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        personsService.getAll().then((data) => {
            setPersons(data);
        });
    }, []);

    const handleSearchQueryChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleNameChange = (event) => {
        setNewName(event.target.value);
    };

    const handleNumberChange = (event) => {
        setNewNumber(event.target.value);
    };

    const addPerson = (event) => {
        event.preventDefault();
        var existingPerson = persons.find((person) => person.name == newName);
        if (existingPerson) {
            triggerNotification(
                `${existingPerson.name} already exists in phonebook.`
            );
            if (
                window.confirm(
                    `${newName} is already added to the phonebook, replace the old number with a new one?`
                )
            ) {
                let person = {
                    name: newName,
                    number: newNumber,
                };
                personsService
                    .put(existingPerson.id, person)
                    .then((data) => {
                        setPersons(
                            persons.map((person) =>
                                person.name == existingPerson.name
                                    ? data
                                    : person
                            )
                        );
                        triggerNotification(`${person.name}'s number updated.`);
                        setNewName("");
                        setNewNumber("");
                    })
                    .catch((error) => {
                        triggerNotification(`${error.response.data.error}`);
                    });
            }
        } else {
            let person = {
                name: newName,
                number: newNumber,
            };
            personsService
                .post(person)
                .then((data) => {
                    setPersons(persons.concat(data));
                    triggerNotification(`${person.name} added to phonebook.`);
                    setNewName("");
                    setNewNumber("");
                })
                .catch((error) => {
                    triggerNotification(`${error.response.data.error}`);
                });
        }
    };

    const deletePerson = (id) => {
        var person = persons.find((person) => person.id == id);
        if (!person) return;
        if (window.confirm(`Are you sure you want to delete ${person.name}?`)) {
            personsService
                .remove(id)
                .then(() => {
                    setPersons(persons.filter((person) => person.id != id));
                    triggerNotification(
                        `${person.name} removed from phonebook.`
                    );
                })
                .catch((error) => {
                    setPersons(persons.filter((person) => person.id != id));
                    triggerNotification(
                        `${person.name} has already been removed from the server.`
                    );
                });
        }
    };

    const filteredPersons = persons.filter((person) =>
        person.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const triggerNotification = (message) => {
        setNotification(message);
        setTimeout(() => {
            setNotification(null);
        }, 5000);
    };

    return (
        <div>
            <Notification message={notification} />
            <h2>Phonebook</h2>
            <Filter
                searchQuery={searchQuery}
                onChange={handleSearchQueryChange}
            />
            <h2>add a new</h2>
            <PersonForm
                onSubmit={addPerson}
                name={newName}
                number={newNumber}
                onNameChange={handleNameChange}
                onNumberChange={handleNumberChange}
            />
            <h2>Numbers</h2>
            <Persons persons={filteredPersons} onDelete={deletePerson} />
        </div>
    );
};

export default App;
