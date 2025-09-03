import { useState } from 'react'

const App = () => {

    // State
    const [persons, setPersons] = useState([
        { name: 'Arto Hellas' }
    ])
    const [newName, setNewName] = useState('')

    // handleFormSubmit
    const handleFormSubmit = e => {
        e.preventDefault();
        const newObj = {name: newName};

        if (persons.find(x => JSON.stringify(x) === JSON.stringify(newObj))) { // assumes attributes are ordered same
            alert(`User already exists with name: ${newObj.name}`);
            return;
        }
        
        setPersons(persons.concat(newObj));
        setNewName('');
    }
    
    // JSX
    return (
        <div>

            <div>debug: {newName}</div>
            
            <h2>Phonebook</h2>

            {/* forms */}
            <form onSubmit={handleFormSubmit}>
                <div>
                    name: 
                    <input
                        value={newName}
                        onChange={(e) => {setNewName(e.target.value)}}
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
                    {p.name}
                </div>
            )}

            
        </div>
    )
}

export default App