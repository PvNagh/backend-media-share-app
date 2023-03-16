import express from "express";
import {
    authenticate,
    followUser,
    unfollowUser,
    getUser
} from "../controller/user-controller.js";
import {
    addPost,
    deletePost,
    likePost,
    unlikePost,
    addComment,
    getUserPost,
    getAllPosts
} from "../controller/post-controller.js";
import { authenticateToken } from "../middleware/auth.js";

const route = express.Router();

route.post("/api/authenticate", authenticate);

route.post("/api/follow/:id", authenticateToken, followUser);
route.post("/api/unfollow/:id", authenticateToken, unfollowUser);

route.get("/api/user", authenticateToken, getUser);

route.post("/api/posts", authenticateToken, addPost);
route.delete("/api/posts/:id", authenticateToken, deletePost);

route.post("/api/like/:id", authenticateToken, likePost);
route.post("/api/unlike/:id", authenticateToken, unlikePost);
route.post("/api/comment/:id", authenticateToken, addComment);

route.get("/api/posts/:id", authenticateToken, getUserPost);
route.get("/api/all_posts", authenticateToken, getAllPosts);

export default route;