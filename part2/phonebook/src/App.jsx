import { useState, useEffect } from 'react'

import ContactsList from './components/ContactsList';
import ContactAdderForm from './components/ContactAdderForm';
import ContactFilter from './components/ContactFilter';
import Notification from './components/Notification';

import personsService from './services/persons';
import ErrorMessage from './components/ErrorMessage';


// isProbablyAPhoneNumber
function isProbablyAPhoneNumber(x) {
    return !isNaN(x.replaceAll('-', '')) && x !== "";
}


// App
const App = () => {

    // app state
    const [persons, setPersons] = useState([]);
    const [newName, setNewName] = useState('');
    const [newNumber, setNewNumber] = useState('');
    const [nameFilter, setNameFilter] = useState('');

    const [notification, setNotification] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    

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

    
    /* handleFormSubmit: new contact form */
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

        
        // update existing contact
        const existingPerson = persons.find(x => x.name.toLowerCase() === newName.toLowerCase());
        if (existingPerson) {
            if (window.confirm(`${newName} already exists in the phonebook (id: ${existingPerson.id}). Update phonenumber to: ${newNumber}?`)) {
                personsService
                    .update(existingPerson.id, personObj)
                    .then(returnedPerson => {
                        setPersons(persons.map(p => (p.id === returnedPerson.id) ? returnedPerson : p))
                        setNewName('');
                        setNewNumber('');
                        setNotification(`updated phone number for "${returnedPerson.name}" (new number: ${returnedPerson.number})`)
                        setTimeout(() => setNotification(null), 3000);
                    })
                    .catch(() => {
                        setPersons(persons.filter(p => p.id !== existingPerson.id));
                        setErrorMessage(`contact "${existingPerson.name}" appears to have been deleted, please resubmit contact`)
                        setTimeout(() => setErrorMessage(null), 4000);
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
                setNotification(`added contact "${returnedPerson.name}" with phone number "${returnedPerson.number}" and id "${returnedPerson.id}"`)
                setTimeout(() => setNotification(null), 4000);
            })
        
    }

    
    /* deleteContact */
    const deleteContact = (id) => {
        const person = persons.find(p => p.id === id);

        if (!window.confirm(`Delete contact "${person.name}" with id: ${id}?`)) {
            console.debug("not deleting contact");
            return;
        }
        
        const updatePersonsAfterDeletion = () => {
            setPersons(persons.filter(p => p.id !== id));
            setNotification(`deleted contact "${person.name}" (id: ${person.id})`)
            setTimeout(() => setNotification(null), 3000)
        }
        
        personsService
            .deletePerson(id)
            .then(updatePersonsAfterDeletion)
            .catch(updatePersonsAfterDeletion)
    }
    

    /* filter contacts */
    const personsToShow = persons.filter(c => 
        c.name.toLowerCase().includes(nameFilter.toLowerCase())
    );


    /* JSX */
    return (
        <div>

            <h1>Phonebook</h1>

            <Notification message={notification} />
            <ErrorMessage message={errorMessage} />

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