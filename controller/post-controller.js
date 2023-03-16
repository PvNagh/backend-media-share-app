import Post from "../model/Post.js";
import User from "../model/User.js";
import Comment from "../model/Comment.js";

export const addPost = async (req, res) => {
    const user = await User.findOne({ email: req.user.email });
    try {
        const { title, description } = req.body;
        const newPost = new Post({
            userId: user._id,
            title: title,
            desc: description,
            createdAt: new Date()
        });

        const createPost = await newPost.save();
        res.status(200).json({
            postId: createPost._id,
            title: createPost.title,
            description: createPost.desc,
            createdAt: createPost.createdAt
        })

    } catch (error) {
        res.status(500).json({ error: error });
    }
}

export const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findOne({ email: req.user.email });
        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({ error: "Post to be deleted was not found" });
        }

        if (post.userId !== user._id.toString()) {
            return res.status(401).json({ error: "Not allowed to delete other's post" });
        }

        await post.deleteOne();
        res.json({ msg: "Post deleted" });

    } catch (error) {
        res.status(500).json({ error: error });
    }
}

export const likePost = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findOne({ email: req.user.email });
        const post = await Post.findById(id);
        if (post.likes.includes(user._id)) {
            return res.status(400).json({ msg: "Post already liked" });
        }
        post.likes.push(user._id);
        await post.save();
        res.status(200).json({ msg: "Post liked" });

    } catch (error) {
        res.status(500).json({ error: error });
    }
}

export const unlikePost = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findOne({ email: req.user.email });
        const post = await Post.findById(id);
        if (!post.likes.includes(user._id)) {
            return res.status(400).json({ msg: "Post is not liked" });
        }
        post.likes = post.likes.filter((userId) => userId.toString() !== user._id.toString());
        await post.save();
        res.status(200).json({ message: "Post unliked" });
    } catch (error) {
        res.status(500).json({ error: error });
    }
}

export const addComment = async (req, res) => {
    try {
        const { comment } = req.body;
        const { id } = req.params;
        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }
        const newComment = new Comment({
            text: comment,
            postId: id
        });
        const createComment = await newComment.save();
        post.comments.push(createComment.text);
        await post.save();
        res.status(200).json({ commentId: createComment._id });

    } catch (error) {
        res.status(500).json({ error: error });
    }
}

export const getUserPost = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }
        const sendPost = {
            numberOfLikes: post.likes.length,
            numberOfComments: post.comments.length
        }
        res.status(200).json(sendPost);
    } catch (error) {
        res.status(500).json({ error: error });
    }
}

export const getAllPosts = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.user.email });
        const posts = await Post.find({ userId: user._id.toString()}).sort({ createdAt: 'desc' });
        const postDetails = posts.map((post) => ({
            id: post._id,
            title: post.title,
            desc: post.desc,
            created_at: post.createdAt,
            comments: post.comments,
            likes: post.likes.length,
          }));
          res.status(200).json(postDetails);

    } catch (error) {
        res.status(500).json({ error: error });
    }
}