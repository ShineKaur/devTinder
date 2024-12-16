const express = require('express');
const userRouter = express.Router();

const { userAuth } = require('../middlewares/auth.js');
const ConnectionRequest = require('../models/connectionrequest.js');
const User = require('../models/user.js');

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

userRouter.get('/feed', userAuth, async (req, res) => {
    try {
        const loggedInUser = await req.user;

        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;
        const skip = (page - 1) * limit;

        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id },
            ]
        }).select("fromUserId toUserId");

        const hideUsersFromFeed = new Set();
        await connectionRequests.forEach((req) => {
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());
        });

        const users = await User.find({
            $and: [
                { _id: { $ne: loggedInUser._id } },
                { _id: { $nin: Array.from(hideUsersFromFeed) } }
            ]
        }).select(USER_SAFE_DATA).skip(skip).limit(limit);

        res.json(users);

    } catch (error) {
        res.status(400).send('ERROR: ' + error.message);
    }

});

module.exports = userRouter;