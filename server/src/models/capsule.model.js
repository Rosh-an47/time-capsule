import mongoose from 'mongoose';

const capsuleSchema = new mongoose.Schema({
    creator: {
        type:mongoose.Schema.Types.ObjectId,
        ref: "User",
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
    },
    notified: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

export default mongoose.model('Capsule', capsuleSchema);