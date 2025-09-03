import { useState } from 'react'
import Note from './components/Note'

const App = (props) => {

  const [notes, setNotes] = useState(props.notes);
  const [newNote, setNewNote] = useState("note placeholder..");
  const [showAll, setShowAll] = useState(false);
  
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