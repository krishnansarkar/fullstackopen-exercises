const mongoose = require("mongoose");

mongoose
    .connect(process.env.MONGODB_URI, { family: 4 })
    .then((result) => {
        console.log("connected to MongoDB");
    })
    .catch((error) => {
        console.log("error connecting to MongoDB", error.message);
    });

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true,
    },
    number: {
        type: String,
        required: true,
        validate: {
            validator: (v) => {
                const parts = v.split("-");
                if (parts.length != 2) return false;
                if (!Number.isInteger(Number(parts[0]))) return false;
                if (parts[0].length != 2 && parts[0].length != 3) return false;
                if (!Number.isInteger(Number(parts[1]))) return false;

                return true;
            },
            message: (props) => `${props.value} is not a valid phone number!`,
        },
    },
});

personSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});

module.exports = mongoose.model("Person", personSchema);
