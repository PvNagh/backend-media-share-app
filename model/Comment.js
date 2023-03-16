import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
});
const Comment = mongoose.model("Comment", CommentSchema);

export default Comment;