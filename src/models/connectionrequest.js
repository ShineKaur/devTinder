const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema(
    {
        fromUserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        toUserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        status: {
            type: String,
            required: true,
            enum: {
                values: ["ignored", "interested", "accepted", "rejected"],
                message: '{VALUE} not a valid status type'
            }
        }
    },
    { timestamps: true }
);

connectionRequestSchema.index({fromUserId: 1 , toUserId: 1}); //1 -> ascending, -1 -> descending

connectionRequestSchema.pre("save", function(next) {
    const connectionRequest = this;
    if(connectionRequest.toUserId.equals(connectionRequest.fromUserId)) {
        throw new Error('Cannot send connection request to yourself!');
    }
    next();
});

const ConnectionRequest = new mongoose.model("ConnectionRequest", connectionRequestSchema);

module.exports = ConnectionRequest;