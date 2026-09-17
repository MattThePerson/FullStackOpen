import { useState, useEffect } from 'react'
import noteService from './services/notes.js'

import Note from './components/Note'
import Footer from './components/Footer.jsx'


// Notification
const Notification = ({ message }) => {
    if (message === null) {
        return null
    }

    return (
        <div className='error'>
            {message}
        </div>
    )
}

// App
const App = () => {

    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState("note placeholder..");
    const [showAll, setShowAll] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null)

    // effect
    useEffect(() => {
        noteService
            .getAll()
            .then(initialNotes => {
                console.log("got notes from backend");
                setNotes(initialNotes);
            })
    }, []);
    console.debug(`rendering ${notes.length} notes`);


    // toggleImportanceOf
    const toggleImportanceOf = (id) => {
        console.log('importance of ' + id + ' needs to be toggled');

        const note = notes.find(n => n.id === id);
        const updatedNote = { ...note, important: !note.important };

        // axios.put(url, updatedNote)
        noteService.update(id, updatedNote)
            .then(returnedNote => {
                setNotes(notes.map(n => (n.id === id) ? returnedNote : n));
            })
            .catch(err => {
                setErrorMessage(
                    `Note '${note.content}' was already removed from server`
                )
                setTimeout(() => {
                    setErrorMessage(null)
                }, 2000)
                setNotes(notes.filter(n => n.id !== id))
            })
    }


    // onSubmit
    const onSubmit = (e) => {
        e.preventDefault();
        const noteObject = {
            content: newNote,
            important: Math.random() < 0.5,
        }

        // post to backend
        noteService
            .create(noteObject)
            .then(returnedNote => {
                console.debug("setting new note:", returnedNote);
                setNotes(notes.concat(returnedNote));
                setNewNote("");
            })
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
            <Notification message={errorMessage} />
            <div>
                <button onClick={() => setShowAll(!showAll)}>
                    show {showAll ? "important" : "all"}
                </button>
            </div>
            <ul>
                {notesToShow.map(note =>
                    <Note key={note.id} note={note} toggleImportance={toggleImportanceOf} />
                )}
            </ul>

            {/* new note form */}
            <form onSubmit={onSubmit}>
                <input
                    value={newNote}
                    onChange={handleInputValueChange}
                />
                <button type="submit">save</button>
            </form>

            <Footer />

        </div>
    )
}

export default App