const express = require('express');

const app = express();

const connectDB = require('./config/database');
const User = require('./models/user');

app.use(express.json());

app.post('/signup', async (req, res) => {
    //Create a new instance of the User model.
    const userObj = new User(req.body);

    try {
        await userObj.save();
        //await User.insertMany(req.body); -- if need to add multiple docs. no need to create diff model as in 12 line.
        res.send('Data saved successfully...');
    } catch (error) {
        res.status(400).send('Error saving User: ' + error.message);
    }
});

app.get('/user', async (req, res) => {
    try {
        const users = await User.find({ emailId: req.body.emailId });
        if (users.length === 0) {
            res.status(404).send('User not found');
        } else {
            res.send(users);
        }
    } catch (error) {
        res.status(400).send('Something went wrong');
    }
});

app.get('/feed', async (req, res) => {
    try {
        const users = await User.find({});
        if (users.length === 0) {
            res.status(404).send('No users found');
        } else {
            res.send(users);
        }
    } catch (error) {
        res.status(400).send('Something went wrong');
    }
});

app.delete('/user', async (req, res) => {
    const userId = req.body.userId;
    try {
        const deleteById = await User.findByIdAndDelete(userId);
        res.send("User deleted successfully");
    } catch (error) {
        console.log(error);
        res.status(400).send('Something went wrong');
    }
});

app.patch('/user', async (req, res) => {
    const userId = req.body.userId;
    const data = req.body;
    try {
        const user = await User.findByIdAndUpdate({ _id: userId }, data, { returnDocument : "after", runValidators: true });
        // or const user = await User.findByIdAndUpdate(userId, data);
        //console.log(user);
        res.send('User updated successfully');
    } catch (error) {
        res.status(400).send('UPDATE FAILED: ' + error.message);
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