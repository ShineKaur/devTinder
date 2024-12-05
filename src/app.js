const express = require('express');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const app = express();

const connectDB = require('./config/database');
const User = require('./models/user');
const { validateSignUpData } = require('./utils/validation.js');
const { userAuth } = require('./middlewares/auth.js');

app.use(express.json());
app.use(cookieParser())

app.post('/signup', async (req, res) => {
    try {
        //1st STEP: Validation of data
        validateSignUpData(req);

        const { firstName, lastName, emailId, password } = req.body;

        //2nd STEP: Encrypt the password
        const passwordHash = await bcrypt.hash(password, 10);

        //Create a new instance of the User model.
        const userObj = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash
        });

        await userObj.save();
        //await User.insertMany(req.body); -- if need to add multiple docs. no need to create diff model as in 12 line.
        res.send('Data saved successfully...');
    } catch (error) {
        res.status(400).send('Error saving User: ' + error.message);
    }
});

app.post('/login', async (req, res) => {
    try {
        const { emailId, password } = req.body;

        const user = await User.findOne({ emailId: emailId });

        if (!user) {
            throw new Error("Invalid credentials!");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (isPasswordValid) {

            //Creat JWT Token
            const token = jwt.sign({ _id: user._id }, "Dev@Tinder28", {
                expiresIn : '1d'
            });

            //send token in cookie
            res.cookie('token', token, {
                expires: new Date(Date.now() + 8 * 3600000),
            });

            res.status(200).send("Login Successful!!!");
        } else {
            throw new Error("Invalid credentials!");
        }

    } catch (err) {
        res.status(400).send('ERROR: ' + err);
    }
});

app.get('/profile', userAuth, async (req, res) => {
    try {
        const user = await req.user;

        res.send(user);
    } catch(error) {
        console.log('ee')
        res.status(400).send('ERROR: ' + error.message);
    }
    
});

app.post('/sendConnectionRequest', userAuth, async(req, res) => {
    const user = await req.user;
    res.send(user.firstName + ' sent the connection request'); 
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