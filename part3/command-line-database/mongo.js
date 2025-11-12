const mongoose = require("mongoose");

if (process.argv.length < 3) {
    console.log("give password as argument");
    process.exit(1);
}
if (process.argv.length != 3 && process.argv.length != 5) {
    console.log("Invalid arguments");
    process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://sarkarkrishnan_db_user:${password}@cluster0.r09cyvo.mongodb.net/phonebook?appName=Cluster0`;

mongoose.connect(url, { family: 4 });

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
});

const Person = mongoose.model("Person", personSchema);

switch (process.argv.length) {
    case 5:
        const person = new Person({
            name: process.argv[3],
            number: process.argv[4],
        });
        person.save().then((result) => {
            console.log(
                `added ${person.name} number ${person.number} to phonebook`
            );
            mongoose.connection.close();
        });
        break;
    case 3:
        Person.find({}).then((result) => {
            console.log("phonebook:");
            result.forEach((person) => {
                console.log(`${person.name} ${person.number}`);
            });
            mongoose.connection.close();
        });
        break;
    default:
        console.log("Something went wrong!");
}
