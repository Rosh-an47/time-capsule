const mongoose = require('mongoose');
const bcrypt = require("bcrypt");


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

//pre hook just before saving


//yettikai vaye harek choti password save garcha
userSchema.pre("save",  async function(next){
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password);
}

module.exports = mongoose.model('User', userSchema);