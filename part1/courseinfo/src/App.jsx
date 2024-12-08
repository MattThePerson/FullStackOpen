
function Header({course}) {
    return (
        <h1>{course}</h1>
    )
}

function Content({part1, ex1, part2, ex2, part3, ex3}) {
    return (
        <>
            <p>
                {part1} {ex1}
            </p>
            <p>
                {part2} {ex2}
            </p>
            <p>
                {part3} {ex3}
            </p>
        </>
    )
}

function Total({total}) {
    return (
        <p>Number of exercises {total}</p>
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
            <Total amount={exercises1 + exercises2 + exercises3} />
        </div>
    )
}

export default App