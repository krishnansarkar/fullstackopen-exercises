import { useState } from "react";

const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>;
const Stat = ({ name, value }) => (
    <p>
        {name} {value}
    </p>
);

const App = () => {
    // save clicks of each button to its own state
    const [good, setGood] = useState(0);
    const [neutral, setNeutral] = useState(0);
    const [bad, setBad] = useState(0);

    const total = good + neutral + bad;

    return (
        <>
            <h1>give feedback</h1>
            <Button onClick={() => setGood(good + 1)} text="good" />
            <Button onClick={() => setNeutral(neutral + 1)} text="neutral" />
            <Button onClick={() => setBad(bad + 1)} text="bad" />
            <h1>statistics</h1>
            <Stat name="good" value={good} />
            <Stat name="neutral" value={neutral} />
            <Stat name="bad" value={bad} />
            <Stat name="all" value={total} />
            <Stat name="average" value={(good - bad) / total} />
            <Stat name="positive" value={`${good / total}%`} />
        </>
    );
};

export default App;
