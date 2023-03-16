import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    following: {
        type: Array,
        default: []
    },
    followers: {
        type: Array,
        default: []
    }
});



const User = mongoose.model("User", UserSchema);
export default User;

