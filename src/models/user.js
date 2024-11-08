const mongoose = require('mongoose');
const validator = require('validator');

//const { Schema } = mongoose;
// const userSchema = new Schema({})

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error('Invalid Email address: ' + value)
            }
        }
    },
    password: {
        type: String,
        validate(value) {
            if(!validator.isStrongPassword(value)) {
                throw new Error('Enter a strong password: ' + value)
            }
        }
    },
    age: {
        type: Number,
        min: 18
    },
    gender: {
        type: String,
        validate(value) {
            if (!["male", "female", "others"].includes(value)) {
                throw new Error('Gener data is not valid');
            }
        }
    },
    photoUrl: {
        type: String,
        validate(value) {
            if(!validator.isURL(value)) {
                throw new Error('Invalid Photo URL: ' + value)
            }
        }
    },
    about: {
        type: String,
        default: "This is the default value of the user!",
    },
    skills: {
        type: [String]
    }
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;