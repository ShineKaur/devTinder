const express = require('express');

const requestRouter = express.Router();

const { userAuth } = require('../middlewares/auth.js');

requestRouter.post('/sendConnectionRequest', userAuth, async(req, res) => {
    const user = await req.user;
    res.send(user.firstName + ' sent the connection request'); 
});

module.exports = requestRouter;