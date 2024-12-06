const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();

const connectDB = require('./config/database');
const User = require('./models/user');

app.use(express.json());
app.use(cookieParser());

const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);

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


/* 
############# Examples of other requests ###############


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

app.patch('/user/:userId', async (req, res) => {
    const userId = req.params?.userId;
    const data = req.body;
    try {
        const ALLOWED_UPDATES = ['photoUrl', 'about', 'gender', 'age', 'skills'];

        const isUpdateAllowed = Object.keys(data).every((k) =>
            ALLOWED_UPDATES.includes(k)
        );
        if (!isUpdateAllowed) {
            throw new Error('Update not allowed');
        }

        if (data?.skills.length > 10) {
            throw new Error('Skills cannot be more than 10.');
        }

        const user = await User.findByIdAndUpdate({ _id: userId }, data, { returnDocument: "after", runValidators: true });
        // or const user = await User.findByIdAndUpdate(userId, data);
        //console.log(user);
        res.send('User updated successfully');
    } catch (error) {
        res.status(400).send('UPDATE FAILED: ' + error.message);
    }
});

*/