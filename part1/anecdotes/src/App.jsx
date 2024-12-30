import { useState } from 'react'

const App = () => {
    const anecdotes = [
        'If it hurts, do it more often.',
        'Adding manpower to a late software project makes it later!',
        'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
        'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
        'Premature optimization is the root of all evil.',
        'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
        'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
        'The only way to go fast, is to go well.'
    ]

    const [selected, setSelected] = useState(0);
    const points_init = {};
    for (let i = 0; i < anecdotes.length; i++) {
        points_init[i] = 0;
    }
    const [points, setPoints] = useState(points_init);

    function setRandomAnecdote() {
        let next_selected = selected;
        while (next_selected == selected)
            next_selected = Math.floor(Math.random() * anecdotes.length);
        setSelected(next_selected);
    }

    function voteForSelected() {
        const new_points = { ...points };
        new_points[selected] += 1;
        console.log(new_points);
        setPoints(new_points);
    }

    function getAnecdoteWithMostVotes() {
        return Object.keys(points).reduce((a, b) => (points[a] > points[b] ? a : b));
    }
    
    return (
        <div>
            <h2>Anecdote of the day ({points[selected]} votes) </h2>
            <div>
                {anecdotes[selected]}
            </div>
            <button onClick={voteForSelected}>vote</button>
            <button onClick={setRandomAnecdote}>next anecdote</button>

            <h2>Anecdote with most votes ({points[getAnecdoteWithMostVotes()]} votes) </h2>
            <div>{anecdotes[getAnecdoteWithMostVotes()]}</div>
        </div>
    )
}

export default App