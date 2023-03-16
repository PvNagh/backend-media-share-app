import User from "../model/User.js";
import jwt from "jsonwebtoken";
const secretKey = "405153d89988d00087565e0ec3f6029efdebc882dd4a7f2afe053ebc145ff4d72622d17af6e36089fa972109aca0bef338ad4e1e5e099725b60c847c19ca8f5f";

//dummy user data pushed to mongodb
// const user = {email:"dfg@gmail.com",password:"1278"};
// const newUser = new User(user);
//  newUser.save();

export const authenticate = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (user && password === user.password) {
            const token = jwt.sign({ email }, secretKey);
            res.status(200).json({ token });
        }
        else {
            res.status(401).json({ error: "Invalid email or password" });
        }
    }
    catch (error) {
        return res.status(500).json({ error: error });
    }
};

export const followUser = async (req, res) => {

    try {
        const { id } = req.params;
        const currentUser = await User.findOne({ email: req.user.email });
        const userToFollow = await User.findById(id);
        if (!userToFollow) {
            return res.status(404).json({ message: "User not found" });
        }

        if (currentUser.following.includes(userToFollow._id)) {
            return res.status(400).json({ message: "You are already following this user" });
        }

        currentUser.following.push(userToFollow._id);
        userToFollow.followers.push(currentUser._id);

        await currentUser.save();
        await userToFollow.save();

        res.status(200).json({ message: "User followed successfully" });
    } catch (error) {
        return res.status(500).json({ error: error });
    }

};

export const unfollowUser = async (req, res) => {

    try {
        const { id } = req.params;//id of the user to be unfollowed
        const currentUser = await User.findOne({ email: req.user.email });
        const userToUnfollow = await User.findById(id);

        if (!userToUnfollow) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!currentUser.following.includes(userToUnfollow._id)) {
            return res.status(400).json({ message: "You are not following this user" });
        }

        currentUser.following = currentUser.following.filter(followingId => followingId.toString() !== id);
        await currentUser.save();

        userToUnfollow.followers = userToUnfollow.followers.filter(followerId => followerId.toString() !== currentUser._id.toString());
        await userToUnfollow.save();

        res.status(200).json({ message: "Successfully unfollowed user." });
    } catch (error) {
        return res.status(500).json({ error: error });
    }
};

export const getUser = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.user.email });
        const { email, followers, following } = user;
        const userProfile = { username: email, followers: followers.length, following: following.length };
        res.json(userProfile);
    } catch (error) {
        res.status(500).json({ error: error });
    }
}