const mongoose = require("mongoose");

const capsuleSchema = new mongoose.Schema({
    creator: {
        type:mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },

    contentType: {
        type: String,
        enum: ["text", "photo", "video", "voice"],
        required: true
    },
    content: {
        type: String,
        required: true
    },
    caption: {
        type: String,
        required: true
    },
    description:{
        type: String
    },
    unlockDate: {
        type: Date,
        required: true
    },
    isUnlocked: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Capsule", capsuleSchema);