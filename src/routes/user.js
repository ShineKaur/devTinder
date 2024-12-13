const express = require('express');
const userRouter = express.Router();

const { userAuth } = require('../middlewares/auth.js');
const ConnectionRequest = require('../models/connectionrequest.js');

const USER_SAFE_DATA = "firstName lastName skills age about gender";

userRouter.get('/user/requests/received', userAuth, async (req, res) => {
    try {
        const loggedInUser = await req.user;

        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", USER_SAFE_DATA);

        res.status(200).json({
            message: "Connection Requests fetched successfully.",
            connectionRequests
        })
    } catch (error) {
        res.status(400).send('ERROR: ' + error.message);
    }
});

userRouter.get('/user/requests/connections', userAuth, async (req, res) => {
    try {
        const loggedInUser = await req.user;

        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id, status: "accepted" },
                { toUserId: loggedInUser._id, status: "accepted" }
            ]
        })
            .populate("fromUserId", USER_SAFE_DATA)
            .populate("toUserId", USER_SAFE_DATA);

        const data = connectionRequests.map((row) => {
            if (row.fromUserId._id.toString() == loggedInUser._id.toString()) {
                return row.toUserId;
            }
            return row.fromUserId;
        });

        res.json({
            data
        })
    } catch (error) {
        res.status(400).send('ERROR: ' + error.message);
    }
});

module.exports = userRouter;