const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    displayName:{
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    profilePicture:{
        type: String, //cloudinary url
    },

    password: {
        type: String,
        required: [true, "Password is Required"]
    },

    refreshToken:{
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);