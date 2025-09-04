import { useState, useEffect } from 'react'
import axios from 'axios';
import Note from './components/Note'

const App = () => {

    // state
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState("note placeholder..");
    const [showAll, setShowAll] = useState(false);

    // effect
    useEffect(() => {
        axios
            .get("http://localhost:3001/notes")
            .then(resp => {
                console.log("promise fullfilled");
                setNotes(resp.data);
            })
    }, []);
    console.log(`render ${notes.length} notes`);

    // onSubmit
    const onSubmit = (e) => {
        e.preventDefault();
        const noteObject = {
            content: newNote,
            important: Math.random() < 0.5,
            id: String(notes.length + 1),
        }
        console.log("SUBMITTING NOTE:", e.target.querySelector("input").value);
        setNotes(notes.concat(noteObject));
        setNewNote("");
    }

    // handleInputValueChange
    const handleInputValueChange = (e) => {
        console.log(e.target.value);
        setNewNote(e.target.value);
    }

    const notesToShow = showAll
        ? notes
        : notes.filter(n => n.important);


    // JSX
    return (
        <div>

            <h1>Notes</h1>

            <div>
                <button onClick={() => setShowAll(!showAll)}>
                    show {showAll ? "important" : "all"}
                </button>
            </div>
            <ul>
                {notesToShow.map(note =>
                    <Note key={note.id} note={note} />
                )}
            </ul>

            <form onSubmit={onSubmit}>
                <input
                    value={newNote}
                    onChange={handleInputValueChange}
                />
                <button type="submit">save</button>
            </form>

        </div>
    )
}

export default App