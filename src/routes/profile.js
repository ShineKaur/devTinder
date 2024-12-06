const express = require('express');

const profileRouter = express.Router();

const { userAuth } = require('../middlewares/auth.js');

profileRouter.get('/profile', userAuth, async (req, res) => {
    try {
        const user = await req.user;
        res.send(user);
    } catch(error) {
        console.log('ee')
        res.status(400).send('ERROR: ' + error.message);
    }
    
});

module.exports = profileRouter;