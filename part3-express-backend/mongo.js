const mongoose = require("mongoose");

const closedb = () => mongoose.connection.close();

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

// const url = `mongodb+srv://fullstack:${password}@cluster0.a5qfl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const url = `mongodb+srv://fullstack:${password}@cluster0.ogtyp4n.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set('strictQuery',false)

mongoose.connect(url, { family: 4 }) // use IPv4

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

/* CREATE NOTE */
// const note = new Note({
//   content: 'This is juse some random garbage',
//   important: false,
// })

// note.save().then(result => {
//   console.log('note saved!')
//   mongoose.connection.close()
// })

/* FIND */

const query = { important: true }
Note.find({}).then(result => {
    result.forEach(note => {
        console.log(note);
    })
    closedb();
    // mongoose.connection.close();
})
