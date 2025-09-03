
function Header({ course }) {
    return (
        <h1>{course.name}</h1>
    )
}

function Content({ course }) {
    // list needs unique 'key', component won't recieve key as prop
    return (
        <div>
            {course.parts.map(part =>
                <Part key={part.name} part={part} />
            )}
        </div>
    )
}

function Total({ course }) {
    let total = 0;
    course.parts.forEach(pt => total += pt.exercises);
    return (
        <p>Number of exercises {total}</p>
    )
}

function Part({ part }) {
    return (
        <p>{part.name} {part.exercises} </p>
    )
}

function Course({course}) {
    console.log("Rendering course ...");
    return (
        <div>
            <Header course={course} />
            <Content course={course} />
            <Total course={course} />
        </div>
    )
}

const App = () => {
    const course = {
        name: 'Half Stack application development',
        parts: [
            {
                name: 'Fundamentals of React',
                exercises: 10
            },
            {
                name: 'Using props to pass data',
                exercises: 7
            },
            {
                name: 'State of a component',
                exercises: 14
            }
        ]
    }

    return (
        <Course course={course} />
    )
}

export default App
