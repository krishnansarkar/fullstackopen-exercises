import { useEffect, useState } from "react";
import axios from "axios";

const Countries = ({ countries }) => {
    if (countries) {
        if (countries.length > 10) {
            return <div>Too many matches, specify another filter</div>;
        } else if (countries.length > 1) {
            return (
                <div>
                    {countries.map((name) => (
                        <p key={name}>{name}</p>
                    ))}
                </div>
            );
        }
    }

    return;
};

const FocusedCountry = ({ country }) => {
    if (country) {
        return (
            <div>
                <h1>{country.name.common}</h1>
                <p>Capital: {country.capital}</p>
                <p>Area: {country.area}</p>
                <h2>Languages</h2>
                <ul>
                    {Object.values(country.languages).map((name) => (
                        <li key={name}>{name}</li>
                    ))}
                </ul>
                <img src={country.flags.png} />
            </div>
        );
    }

    return;
};

function App() {
    const [countries, setCountries] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [foundCountries, setFoundCountries] = useState(null);
    const [focusedCountry, setFocusedCountry] = useState(null);

    useEffect(() => {
        axios
            .get("https://studies.cs.helsinki.fi/restcountries/api/all")
            .then((response) => {
                setCountries(
                    response.data.map((country) => country.name.common)
                );
            });
    }, []);

    const handleSearchQueryChange = (event) => {
        setSearchQuery(event.target.value);
        const newFoundCountries = countries.filter((name) =>
            name.toLowerCase().includes(event.target.value.toLowerCase())
        );

        setFoundCountries(newFoundCountries);

        if (newFoundCountries.length == 1) {
            axios
                .get(
                    `https://studies.cs.helsinki.fi/restcountries/api/name/${newFoundCountries[0]}`
                )
                .then((response) => {
                    setFocusedCountry(response.data);
                });
        } else {
            setFocusedCountry(null);
        }
    };

    if (countries) {
        return (
            <div>
                <div>
                    find countries{" "}
                    <input
                        value={searchQuery}
                        onChange={handleSearchQueryChange}
                    />
                </div>
                <FocusedCountry country={focusedCountry} />
                <Countries countries={foundCountries} />
            </div>
        );
    }
    return;
}

export default App;
