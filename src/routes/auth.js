const express = require('express');

const authRouter = express.Router();

const bcrypt = require('bcrypt');
const { validateSignUpData } = require('../utils/validation.js');
const User = require('../models/user');

authRouter.post("/signup", async (req, res) => {
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
        res.status(400).json({ message: error.message});
    }
});

authRouter.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;

        const user = await User.findOne({ emailId: emailId });

        if (!user) {
            throw new Error("Invalid credentials!");
        }

        const isPasswordValid = await user.validatePassword(password);

        if (isPasswordValid) {

            //Creat JWT Token
            const token = await user.getJWT();

            //send token in cookie
            res.cookie('token', token, {
                expires: new Date(Date.now() + 8 * 3600000),
            });

            res.status(200).send("Login Successful!!!");
        } else {
            throw new Error("Invalid credentials!");
        }

    } catch (err) {
        res.status(400).json({ message: error.message});
    }
});

authRouter.post("/logout", async (req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now())
    });
    res.status(200).send("Logout successfull!!!!!");
});

module.exports = authRouter;