import { useState, useEffect } from "react";
import axios from "axios";

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

const Person = ({ name, number }) => (
    <p>
        {name} {number}
    </p>
);

const Persons = ({ persons }) => (
    <div>
        {persons.map((person) => (
            <Person
                key={person.name}
                name={person.name}
                number={person.number}
            />
        ))}
    </div>
);

const App = () => {
    const [persons, setPersons] = useState([]);
    const [newName, setNewName] = useState("");
    const [newNumber, setNewNumber] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        axios.get("http://localhost:3002/persons").then((response) => {
            setPersons(response.data);
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
        if (persons.find((person) => person.name == newName)) {
            alert(`${newName} is already added to phonebook`);
        } else {
            let person = {
                name: newName,
                number: newNumber,
            };
            setPersons(persons.concat(person));
            setNewName("");
            setNewNumber("");
        }
    };

    const filteredPersons = persons.filter((person) =>
        person.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div>
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
            <Persons persons={filteredPersons} />
        </div>
    );
};

export default App;
