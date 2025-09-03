
function Header({ course }) {
    return (
        <h2>{course.name}</h2>
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
    const total = course.parts.reduce((acc, curr, idx) => {
        if (acc.exercises) acc = acc.exercises;
        // console.log(idx, acc, curr.exercises);
        return acc + curr.exercises;
    });
    return (
        <strong><p>Number of exercises {total}</p></strong>
    )
}

function Part({ part }) {
    return (
        <p>{part.name} {part.exercises} </p>
    )
}

function Course({ course }) {
    console.log("rendering course");
    return (
        <div>
            <Header course={course} />
            <Content course={course} />
            <Total course={course} />
        </div>
    )
}

const App = () => {
    const courses = [
        {
            name: 'Half Stack application development',
            id: 1,
            parts: [
                {
                    name: 'Fundamentals of React',
                    exercises: 10,
                    id: 1
                },
                {
                    name: 'Using props to pass data',
                    exercises: 7,
                    id: 2
                },
                {
                    name: 'State of a component',
                    exercises: 14,
                    id: 3
                },
                {
                    name: 'Redux',
                    exercises: 11,
                    id: 4
                }
            ]
        },
        {
            name: 'Node.js',
            id: 2,
            parts: [
                {
                    name: 'Routing',
                    exercises: 3,
                    id: 1
                },
                {
                    name: 'Middlewares',
                    exercises: 7,
                    id: 2
                }
            ]
        }
    ]

    return (
        <>
            <h1>Web development curriculum</h1>
            {courses.map(course => 
                <Course key={course.id} course={course} />
            )}
        </>
    )
}

export default App
