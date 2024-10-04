const express = require('express');

const app = express();

const connectDB = require('./config/database');
const User = require('./models/user');

app.post('/signup', async (req, res) => {
    //Create a new instance of the User model.
    const userObj = new User({
        firstName: 'Shine',
        lastName: 'Kaur',
        emailId: 'shine@kaur.com',
        password: 'shine@123',
        age: 30,
        gender: 'F'
    });

    try {
        await userObj.save();
        res.send('Data saved successfully...');
    } catch(error) {
        res.status(400).send('Error saving User: ' + error.message);
    }
});

connectDB()
.then(() => {
    console.log('DB connection successfull....');
    app.listen(3000, () => {
        console.log('PORT started on 3000...');
    });
}
)
.catch((err) => {
    console.log('Database connection failed...');
});