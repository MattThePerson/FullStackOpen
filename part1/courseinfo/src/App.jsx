
function Header({ course }) {
    return (
        <h1>{course}</h1>
    )
}

function Content({ parts }) {
    console.log(parts);
    // list needs unique 'key', component won't recieve key as prop
    return (
        <div>
            {parts.map(part => <Part key={part.name} part={part} />)}
        </div>
    )
}

function Total({ parts }) {
    let total = 0;
    parts.forEach(pt => total += pt.exercises);
    return (
        <p>Number of exercises {total}</p>
    )
}

function Part({ part }) {
    return (
        <p>{part.name} {part.exercises} </p>
    )
}

const App = () => {
    const course = 'Half Stack application development'
    const parts = [
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

    return (
        <div>
            <Header course={course} />
            <Content parts={parts}/>
            <Total parts={parts} />
        </div>
    )
}

export default App