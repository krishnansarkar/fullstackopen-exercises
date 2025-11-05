import { useEffect, useState } from "react";
import axios from "axios";
import { fetchWeatherApi } from "openmeteo";

const Countries = ({ countries, onClick }) => {
    if (countries) {
        if (countries.length > 10) {
            return <div>Too many matches, specify another filter</div>;
        } else if (countries.length > 1) {
            return (
                <div>
                    {countries.map((name) => (
                        <div key={name}>
                            {name}{" "}
                            <button onClick={() => onClick(name)}>Show</button>
                        </div>
                    ))}
                </div>
            );
        }
    }

    return;
};

const FocusedCountry = ({ country, weather }) => {
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
                <h2>Weather in {country.capital}</h2>
                <p>Temperature {country.weather.temp} Celsius</p>
                <p>Wind {country.weather.wind} m/s</p>
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

    const updateQuery = (value) => {
        setSearchQuery(value);
        const newFoundCountries = countries.filter((name) =>
            name.toLowerCase().includes(value.toLowerCase())
        );

        setFoundCountries(newFoundCountries);

        if (newFoundCountries.length == 1) {
            if (
                !focusedCountry ||
                focusedCountry.name.common.toLowerCase() !=
                    newFoundCountries[0].toLowerCase()
            ) {
                axios
                    .get(
                        `https://studies.cs.helsinki.fi/restcountries/api/name/${newFoundCountries[0]}`
                    )
                    .then((response) => {
                        let country = response.data;
                        axios
                            .get(
                                `https://geocoding-api.open-meteo.com/v1/search?name=${country.capital}&count=1&language=en&format=json`
                            )
                            .then((response) => {
                                const result = response.data.results[0];
                                const params = {
                                    latitude: result.latitude,
                                    longitude: result.longitude,
                                    current: [
                                        "temperature_2m",
                                        "wind_speed_10m",
                                    ],
                                    wind_speed_unit: "ms",
                                    forecastDays: 1,
                                };
                                const url =
                                    "https://api.open-meteo.com/v1/forecast";
                                fetchWeatherApi(url, params).then(
                                    (responses) => {
                                        const current = responses[0].current();
                                        const weather = {
                                            temp: current.variables(0).value(),
                                            wind: current.variables(0).value(),
                                        };
                                        country.weather = weather;
                                        setFocusedCountry(country);
                                    }
                                );
                            });
                    });
            }
        } else {
            setFocusedCountry(null);
        }
    };

    const handleSearchQueryChange = (event) => {
        updateQuery(event.target.value);
    };

    const handleShowClick = (name) => {
        updateQuery(name);
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
                <Countries
                    countries={foundCountries}
                    onClick={handleShowClick}
                />
            </div>
        );
    }
    return;
}

export default App;
