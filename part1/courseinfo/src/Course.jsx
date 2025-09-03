

export function Course({ course }) {
    console.log("rendering course (from module):", course.name);
    return (
        <div>
            <Header course={course} />
            <Content course={course} />
            <Total course={course} />
        </div>
    )
}



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
