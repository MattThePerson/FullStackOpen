

// ContactsList
const ContactsList = ({personsToShow}) => {
    return (
        <div>
            {personsToShow.map((p) => 
                <Contact
                    key={p.id}
                    name={p.name}
                    number={p.number}
                />
            )}
        </div>
    )
}


// Contact
const Contact = ({name, number}) => {
    return (
        <div>
            {name} {number}
        </div>
    )
}

export default ContactsList;