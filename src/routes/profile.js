const express = require('express');

const profileRouter = express.Router();

const { userAuth } = require('../middlewares/auth.js');
const { validateEditProfileData, validatePasswordForPasswordChange } = require('../utils/validation.js');
const User = require('../models/user.js');

profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {
        const user = await req.user;
        res.send(user);
    } catch(error) {
        res.status(400).send('ERROR: ' + error.message);
    }
});

profileRouter.post("/profile/edit", userAuth, async (req, res) => {
    try {
        if(!validateEditProfileData(req)) {
            throw new Error('Invalid Edit Request');
        };
        const loggedInUser = await req.user;

        Object.keys(req.body).forEach((key) => (
            loggedInUser[key] = req.body[key]
        ));
        
        await loggedInUser.save();

        res.json({
            message: `${loggedInUser.firstName}, your profile is updated successfully.`,
            data: loggedInUser
        })
    } catch(error) {
        res.status(400).send('ERROR: '+ error.message);
    }
});

profileRouter.patch("/profile/changepassword", userAuth, async (req, res) => {
    try{
        const passwordChangeUser = await req.user;
        const { currentPassword } = req.body;

        const isexistingPasswordValid = await passwordChangeUser.validatePassword(currentPassword);
        if(!isexistingPasswordValid) {
            throw new Error("Existing password is not valid!!!");
        }
        
        const finalPassword = await validatePasswordForPasswordChange(req, passwordChangeUser);

        passwordChangeUser.password = finalPassword;
        passwordChangeUser.save();

        res.status(200).send(`${passwordChangeUser.firstName}, your password has been updated.`);
    } catch(err) {
        res.status(400).send('ERROR: ' + err.message);
    }
});

profileRouter.patch("/profile/forgotpassword", async (req, res) => {
    try {
        const { emailId } = req.body;

        const user = await User.findOne({ emailId : emailId });
         
        if(!user) {
            throw new Error('EmailId does not exist.')
        } 

        const finalPassword = await validatePasswordForPasswordChange(req, user);

        user.password = finalPassword;
        user.save();

        res.status(200).send(`Your password has been updated.`);
    } catch(error) {
        res.status(400).send('ERROR: ' + error.message);
    }
    
});

module.exports = profileRouter;