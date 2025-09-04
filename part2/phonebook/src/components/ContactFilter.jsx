

const ContactFilter = ({nameFilter, setNameFilter}) => {
    return (
        <div>Filter names:
            <input
                value={nameFilter}
                onChange={e => setNameFilter(e.target.value)}
            />
        </div>
    )
}

export default ContactFilter