const mongoose = require("mongoose");

if (process.argv.length < 3) {
    console.log("you must give password as CLI argument: node <file> <password>")
    process.exit();
}

const closeconn = () => mongoose.connection.close();

/* connect */

const password = process.argv[2];
const url = `mongodb+srv://fullstack:${password}@cluster0.ogtyp4n.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0`;
mongoose.connect(url, { family: 4 });

/* model */

const Contact = mongoose.model("Contact", new mongoose.Schema({
    name: String,
    number: String,
}))

function addContact(name, number) {
    const new_contact = new Contact({
        name: name,
        number: number,
    });
    new_contact.save().then(result => {
        console.log(`added ${name} number ${number}`);
        closeconn();
    })
}

function fetchContacts() {
    const query = {};
    Contact.find(query).then(result => {
        console.log("phonebook:")
        result.forEach(c => {
            console.log(`${c.name} - ${c.number}`);
        })
        closeconn();
    })
}

/* main */

if (process.argv.length >= 5) {
    const name = process.argv[3];
    const number = process.argv[4];
    console.log(`name: ${name}\nnumber: ${number}`);
    addContact(name, number);
} else {
    fetchContacts();
}
