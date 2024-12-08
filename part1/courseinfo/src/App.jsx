
function Header({course}) {
    return (
        <h1>{course}</h1>
    )
}

function Content({part1, ex1, part2, ex2, part3, ex3}) {
    return (
        <div>
            <Part part={part1} ex={ex1} />
            <Part part={part2} ex={ex2} />
            <Part part={part3} ex={ex3} />
        </div>
    )
}

function Total({total}) {
    return (
        <p>Number of exercises {total}</p>
    )
}

function Part({part, ex}) {
    return (
        <p>{part} {ex} </p>
    )
}

const App = () => {
    const course = 'Half Stack application development'
    const part1 = 'Fundamentals of React'
    const exercises1 = 10
    const part2 = 'Using props to pass data'
    const exercises2 = 7
    const part3 = 'State of a component'
    const exercises3 = 14

    return (
        <div>
            <Header course={course} />
            <Content 
                part1={part1} ex1={exercises1}
                part2={part2} ex2={exercises2}
                part3={part3} ex3={exercises3}
            />
            <Total total={exercises1 + exercises2 + exercises3} />
        </div>
    )
}

export default App