import { useState } from 'react'

// isProbablyAPhoneNumber
function isProbablyAPhoneNumber(x) {
    return !isNaN(x.replaceAll('-', ''))
}

// filterContacts
function filterContacts(contacts, filter) {
    const filter_lc = filter.toLowerCase();
    return contacts.filter(c => 
        c.name.toLowerCase().includes(filter_lc)
    );
}

// App
const App = () => {

    // State
    const [persons, setPersons] = useState([
        { id: 0, name: 'Matti Mustonen', number: "045-1234" },
        { id: 1, name: 'Arto Hellas', number: '040-123456'},
        { id: 2, name: 'Ada Lovelace', number: '39-44-5323523'},
        { id: 3, name: 'Dan Abramov', number: '12-43-234345'},
        { id: 4, name: 'Mary Poppendieck', number: '39-23-6423122' }
    ])
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [nameFilter, setNameFilter] = useState('')

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

    // filter contacts
    const personsToShow = filterContacts(persons, nameFilter);
    
    // JSX
    return (
        <div>

            {/* <div>debug: {nameFilter}</div> */}
            
            <h1>Phonebook</h1>

            {/* search */}
            <div>Filter names:
                <input
                    value={nameFilter}
                    onChange={e => setNameFilter(e.target.value)}
                />
            </div>

            {/* forms */}
            <h2>Add new contact</h2>
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
            <h2>Contacts</h2>
            {personsToShow.map((p) => 
                <div key={p.name}>
                    {p.name} {p.number}
                </div>
            )}

            
        </div>
    )
}

export default App