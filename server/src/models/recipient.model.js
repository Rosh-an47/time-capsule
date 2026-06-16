import mongoose from 'mongoose';

const recipientSchema = new mongoose.Schema({
    capsule:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Capsule",
        required: true
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null  // null if recipient doesn't have an account
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    hasViewed: {
        type: Boolean,
        default: false
    },
    viewedAt: {
        type: Date,
        default: null
    }
},{
    timestamps: true
});

export default mongoose.model('Recipient', recipientSchema);