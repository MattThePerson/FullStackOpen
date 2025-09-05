

// ContactsList
const ContactsList = ({personsToShow, deleteContactFunc}) => {
    return (
        <div>
            {personsToShow.map((p) => 
                <Contact
                    key={p.id}
                    id={p.id}
                    name={p.name}
                    number={p.number}
                    deleteContactFunc={deleteContactFunc}
                />
            )}
        </div>
    )
}


// Contact
const Contact = ({id, name, number, deleteContactFunc}) => {
    return (
        <div>
            {name} {number}
            <button onClick={() => deleteContactFunc(id)}>delete</button>
        </div>
    )
}

export default ContactsList;