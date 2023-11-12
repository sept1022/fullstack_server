const mongoose = require('mongoose')

if (process.argv.length < 5) {
    console.log('give password, person name, phone number as arguments')
}

const password = process.argv[2]

const url = `mongodb+srv://sept102:${password}@cluster0.96xbmec.mongodb.net/?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
    name: "Peter",
    number: "010-0000-0000"
})

// person.save().then(result => {
// 	console.log('person saved!')
// 	mongoose.connection.close()
// })

Person.find({}).then((result) => {
    result.forEach(person => console.log(person))
    mongoose.connection.close()
})

