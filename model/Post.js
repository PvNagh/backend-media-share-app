import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        desc: {
            type: String,
            required: true,
        },
        comments: {
          type:Array,
          default: []
        },
        likes: {
            type: Array,
            default: []
        },
        createdAt: {
            type: String
        },

    });

const Post = mongoose.model("Post", PostSchema);

export default Post;