import { useState, useEffect } from 'react'

import ContactsList from './components/ContactsList';
import ContactAdderForm from './components/ContactAdderForm';
import ContactFilter from './components/ContactFilter';

import personsService from './services/persons';


// isProbablyAPhoneNumber
function isProbablyAPhoneNumber(x) {
    return !isNaN(x.replaceAll('-', '')) && x !== "";
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


    // fetch initial persons
    useEffect(() => {
        personsService
            .getAll()
            .then(initialPersons => {
                console.debug("fetched initial persons");
                setPersons(initialPersons);
            })
    }, [])
    console.debug(`amount of persons ${persons.length}`);

    
    // handleFormSubmit
    const handleFormSubmit = (e) => {
        e.preventDefault();

        if (persons.find(x => x.name.toLowerCase() === newName.toLowerCase())) { // assumes attributes are ordered same
            alert(`User already exists with name: ${newName}`);
            return;
        }

        if (!isProbablyAPhoneNumber(newNumber)) {
            alert(`\"${newNumber}\" is not a valid phone number`)
            return;
        }
        
        // add new person
        const newObj = {
            name: newName,
            number: newNumber,
        };
        personsService
            .create(newObj)
            .then(returnedPerson => {
                console.log(returnedPerson);
                setPersons(persons.concat(returnedPerson))
                setNewName('');
                setNewNumber('');
            })
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