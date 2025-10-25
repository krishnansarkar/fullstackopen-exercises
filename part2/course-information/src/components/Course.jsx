const Header = (props) => <h1>{props.course}</h1>;

const Content = (props) => (
    <div>
        {props.parts.map((part) => (
            <Part key={part.id} part={part} />
        ))}
    </div>
);

const Part = (props) => (
    <p>
        {props.part.name} {props.part.exercises}
    </p>
);

const Total = (props) => (
    <p>
        <b>total of {props.total} exercises</b>
    </p>
);

const Course = ({ course }) => {
    return (
        <div>
            <Header course={course.name} />
            <Content parts={course.parts} />
            <Total
                total={course.parts.reduce(
                    (total, part) => total + part.exercises,
                    0
                )}
            />
        </div>
    );
};

export default Course;
