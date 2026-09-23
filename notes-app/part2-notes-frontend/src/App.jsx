import { useState, useEffect, useRef } from 'react'
import Note from './components/Note'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import Notification from './components/Notification'
import NoteForm from './components/NoteForm'
import noteService from './services/notes'
import loginService from './services/login'
import localStore from './services/localStorage'

const App = () => {
  const [notes, setNotes] = useState([])
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const noteFormRef = useRef()

  const addNote = (noteObject) => {
    noteFormRef.current.toggleVisibility()
    noteService
      .create(noteObject)
      .then((returnedNote) => {
        setNotes(notes.concat(returnedNote))
      })
  }

  const toggleImportanceOf = (id) => {
    const note = notes.find((n) => n.id === id)
    const changedNote = { ...note, important: !note.important }

    noteService
      .update(id, changedNote)
      .then((returnedNote) => {
        setNotes(notes.map((note) => (note.id !== id ? note : returnedNote)))
      })
      .catch(() => {
        setErrorMessage(
          `Note '${note.content}' was already removed from server`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setNotes(notes.filter((n) => n.id !== id))
      })
  }

  // handle: login
  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      localStore.setJson('loggedNoteAppUser', user)
      noteService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch {
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  // load existing notes at startup
  useEffect(() => {
    noteService.getAll().then((initialNotes) => {
      setNotes(initialNotes)
    })
  }, [])

  // check logged in user
  useEffect(() => {
    const loggedInUser = localStore.getJson('loggedNoteAppUser')
    if (loggedInUser) {
      setUser(loggedInUser)
      noteService.setToken(loggedInUser.token)
    }
  }, [])

  /* RETURN */
  const notesToShow = showAll ? notes : notes.filter((note) => note.important)

  return (
    <>
      <h1>Notes</h1>
      <Notification message={errorMessage} />

      {/* login */}
      <Togglable buttonLabel="login">
        <LoginForm
          handleSubmit={handleLogin}
          handleUsernameChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
          username={username}
          password={password}
        />
      </Togglable>

      {/* new note */}
      <Togglable buttonLabel="new note" reff={noteFormRef}>
        <NoteForm
          createNote={addNote}
        />
      </Togglable>

      {/* notes */}
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>
        {notesToShow.map((note) => (
          <Note
            key={note.id}
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)}
          />
        ))}
      </ul>

    </>
  )
}

export default App
