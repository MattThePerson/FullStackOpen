import { useState, useEffect } from 'react'

import ContactsList from './components/ContactsList';
import ContactAdderForm from './components/ContactAdderForm';
import ContactFilter from './components/ContactFilter';

import personsService from './services/persons';


// isProbablyAPhoneNumber
function isProbablyAPhoneNumber(x) {
    return !isNaN(x.replaceAll('-', '')) && x !== "";
}


// App
const App = () => {

    const [persons, setPersons] = useState([]);
    const [newName, setNewName] = useState('');
    const [newNumber, setNewNumber] = useState('');
    const [nameFilter, setNameFilter] = useState('');


    /* fetch initial persons */
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

        if (!isProbablyAPhoneNumber(newNumber)) {
            alert(`\"${newNumber}\" is not a valid phone number`);
            return;
        }
        
        const personObj = {
            name: newName,
            number: newNumber,
        };
        
        // update phone number
        const existingPerson = persons.find(x => x.name.toLowerCase() === newName.toLowerCase());
        if (existingPerson) {
            if (window.confirm(`${newName} already exists in the phonebook (id: ${existingPerson.id}). Update phonenumber to: ${newNumber}?`)) {
                personsService
                    .update(existingPerson.id, personObj)
                    .then(returnedPerson => {
                        setPersons(persons.map(p => (p.id === returnedPerson.id) ? returnedPerson : p))
                    })
            }
            return;
        }

        // add new contact
        personsService
            .create(personObj)
            .then(returnedPerson => {
                setPersons(persons.concat(returnedPerson))
                setNewName('');
                setNewNumber('');
            })
    }

    
    // deleteContact
    const deleteContact = (id) => {
        const person = persons.find(p => p.id === id);

        if (!window.confirm(`Delete contact "${person.name}" with id: ${id}?`)) {
            console.debug("not deleting contact");
            return
        }
        
        personsService
            .deletePerson(id)
            .then(() => {
                setPersons(persons.filter(p => p.id !== id));
            })
    }
    

    /* filter contacts */
    const personsToShow = persons.filter(c => 
        c.name.toLowerCase().includes(nameFilter.toLowerCase())
    );


    /* JSX */
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
                deleteContactFunc={deleteContact}
            />
            
        </div>
    )
}

export default App