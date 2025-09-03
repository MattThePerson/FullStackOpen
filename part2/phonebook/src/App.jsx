import { useState } from 'react'

// isProbablyAPhoneNumber
function isProbablyAPhoneNumber(x) {
    return !isNaN(x.replaceAll('-', ''))
}

// App
const App = () => {

    // State
    const [persons, setPersons] = useState([
        { id: 0, name: 'Arto Hellas', number: 1234, }
    ])
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')

    // handleFormSubmit
    const handleFormSubmit = e => {
        e.preventDefault();

        if (persons.find(x => x.name.toLowerCase() === newName.toLowerCase())) { // assumes attributes are ordered same
            alert(`User already exists with name: ${newName}`);
            return;
        }

        if (!isProbablyAPhoneNumber(newNumber)) {
            alert(`'${newNumber}' is not a valid phone number`)
            return;
        }
        
        const newObj = {
            id: persons.length,
            name: newName,
            number: newNumber,
        };
        setPersons(persons.concat(newObj));
        setNewName('');
        setNewNumber('');
    }
    
    // JSX
    return (
        <div>

            <div>debug: {newName}</div>
            
            <h2>Phonebook</h2>

            {/* forms */}
            <form onSubmit={handleFormSubmit}>
                <div>
                    name: <input
                        value={newName}
                        onChange={(e) => {setNewName(e.target.value)}}
                    />
                </div>
                <div>
                    number: <input
                        value={newNumber}
                        onChange={(e) => {setNewNumber(e.target.value)}}
                    />
                </div>
                <div>
                    <button type="submit">add</button>
                </div>
            </form>

            {/* numbers */}
            <h2>Numbers</h2>
            {persons.map((p) => 
                <div key={p.name}>
                    {p.name} {p.number}
                </div>
            )}

            
        </div>
    )
}

export default App