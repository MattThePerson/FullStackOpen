
function Header({ course }) {
    return (
        <h1>{course}</h1>
    )
}

function Content({ part1, ex1, part2, ex2, part3, ex3 }) {
    return (
        <div>
            <Part part={part1} ex={ex1} />
            <Part part={part2} ex={ex2} />
            <Part part={part3} ex={ex3} />
        </div>
    )
}

function Total({ total }) {
    return (
        <p>Number of exercises {total}</p>
    )
}

function Part({ part, ex }) {
    return (
        <p>{part} {ex} </p>
    )
}

const App = () => {
    const course = 'Half Stack application development'
    const part1 = {
        name: 'Fundamentals of React',
        exercises: 10
    }
    const part2 = {
        name: 'Using props to pass data',
        exercises: 7
    }
    const part3 = {
        name: 'State of a component',
        exercises: 14
    }
    const exercises3 = 14

    return (
        <div>
            <Header course={course} />
            <Content
                part1={part1.name} ex1={part1.exercises}
                part2={part2.name} ex2={part2.exercises}
                part3={part3.name} ex3={part3.exercises}
            />
            <Total total={part1.exercises + part2.exercises + part3.exercises} />
        </div>
    )
}

export default App