const express = require('express');

const requestRouter = express.Router();

const { userAuth } = require('../middlewares/auth.js');
const ConnectionRequest = require('../models/connectionrequest.js');
const User = require('../models/user.js');

requestRouter.post('/request/send/:status/:toUserId', userAuth, async (req, res) => {
    try {
        const user = await req.user
        const fromUserId = user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatus = ["ignored", "interested"];
        if (!allowedStatus.includes(status)) {
            throw new Error('Invalid status type: ' + status);
        };

        /*if(toUserId == fromUserId) {
            throw new Error('Connection request cannot be sent to itself!');
        }*/ /* Another way is writing pre in the schema validation. */

        const toUser = await User.findById(toUserId);
        if (!toUser) {
            throw new Error('User Not Found');
        }

        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        });

        if (existingConnectionRequest) {
            throw new Error('Connection request already exists!');
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        });

        const data = await connectionRequest.save();

        res.json({
            message: user.firstName + ' is ' + status + ' in ' + toUser.firstName,
            data
        });
    } catch (err) {
        res.status(400).send('ERROR: ' + err.message);
    }

});

module.exports = requestRouter;