import { useState, useEffect } from 'react'
import axios from 'axios';

import ContactsList from './components/ContactsList';
import ContactAdderForm from './components/ContactAdderForm';
import ContactFilter from './components/ContactFilter';



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
    const [persons, setPersons] = useState([]);
    const [newName, setNewName] = useState('');
    const [newNumber, setNewNumber] = useState('');
    const [nameFilter, setNameFilter] = useState('');


    // fetch persons from server
    useEffect(() => {
        axios
            .get("http://localhost:3001/persons")
            .then(resp => {
                console.log("response from server");
                setPersons(resp.data);
            })
    }, [])
    console.log(`amount of persons ${persons.length}`);

    
    // handleFormSubmit
    const handleFormSubmit = (e) => {
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
            id: persons.length+1,
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

            <h1>Phonebook</h1>

            <ContactFilter
                nameFilter={nameFilter}
                setNameFilter={setNameFilter}
            />

            <h2>Add new contact</h2>
            <ContactAdderForm
                newName={newName}
                newNumber={newNumber}
                setNewName={setNewName}
                setNewNumber={setNewNumber}
                handleFormSubmit={handleFormSubmit}
            />

            <h2>Contacts</h2>
            <ContactsList
                personsToShow={personsToShow}
            />
            
        </div>
    )
}

export default App