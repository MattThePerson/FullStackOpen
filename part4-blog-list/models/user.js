const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
});

userSchema.set("toJSON", {
    transform: (document, retObj) => {
        retObj.id = retObj._id.toString();
        delete retObj._id;
        delete retObj.__v;
        delete retObj.passwordHash;
    }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
