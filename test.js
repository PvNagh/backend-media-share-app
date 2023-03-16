//use command npx mocha test.js           to run the file

import chai from "chai";
import chaiHttp from "chai-http";
import { app } from "./index.js";
import Post from "./model/Post.js";
import User from "./model/User.js";
import Comment from "./model/Comment.js";

chai.use(chaiHttp);
const expect = chai.expect;

//dummy user data pushed to mongodb
// const user = {email:"dfg@gmail.com",password:"1278"};
// const user = {email:"abc@gmail.com",password:"1234"};
// const newUser = new User(user);
//  newUser.save();

describe('Authentication Endpoint', () => {
    describe('POST /api/authenticate', () => {
        it('should return a JWT token when given valid credentials', (done) => {
            chai
                .request(app)
                .post('/api/authenticate')
                .send({ email: 'abc@gmail.com', password: '1234' })//testing using a dummy data already feeded to db
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('token');
                    done();
                });
        }).timeout(50000);

        it('should return an error message when given invalid credentials', (done) => {
            chai
                .request(app)
                .post('/api/authenticate')
                .send({ email: 'invaliduser@example.com', password: 'invalidpassword' })
                .end((err, res) => {
                    expect(res).to.have.status(401);
                    expect(res.body).to.have.property('error', "Invalid email or password");
                    done();
                });
        }).timeout(50000);
    });
});

describe('Follow Endpoint', () => {
    describe('POST /api/follow/:id', () => {
        it('should follow a user when given a valid user ID and authentication token', async () => {

            const userToFollow = new User({
                email: 'user_to_follow@gmail.com',
                password: 'password123'
            });
            await userToFollow.save();
            const userToFollowId = userToFollow._id.toString();

            const user = new User({
                email: 'testuser@gmail.com',
                password: 'password123'
            });
            await user.save();
            const resToken = await chai.request(app)
                .post('/api/authenticate')
                .send({ email: 'testuser@gmail.com', password: 'password123' });
            const authToken = resToken.body.token;

            const resFollow = await chai.request(app)
                .post(`/api/follow/${userToFollowId}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(resFollow).to.have.status(200);
            expect(resFollow.body).to.have.property('message', 'User followed successfully');

            await User.deleteOne({ _id: user._id });
            await User.deleteOne({ _id: userToFollow._id });
        }).timeout(50000);
    });
});


describe('Post Endpoint', () => {
    describe('POST /api/posts', () => {
        it('should add a new post when given a valid title, description and authentication token', async () => {

            const resToken = await chai.request(app)
                .post('/api/authenticate')
                .send({ email: 'abc@gmail.com', password: '1234' });
            const authToken = resToken.body.token;

            const resAddPost = await chai.request(app)
                .post('/api/posts')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ title: 'Test Post', description: 'This is a test post' });

            expect(resAddPost).to.have.status(200);
            expect(resAddPost.body).to.have.property('postId');
            expect(resAddPost.body).to.have.property('title', 'Test Post');
            expect(resAddPost.body).to.have.property('description', 'This is a test post');

            await Post.deleteOne({ title: 'Test Post' });
        }).timeout(50000);
    });
});

describe('Comment Endpoint', () => {
    describe('POST /api/comment/:id', () => {
        it('should add a comment to a post when given a valid post ID, authentication token and comment', async () => {

            const authUser = new User({
                email: 'testauthuser@gmail.com',
                password: 'password456'
            });
            await authUser.save();

            const resToken = await chai.request(app)
                .post('/api/authenticate')
                .send({ email: 'testauthuser@gmail.com', password: 'password456' });
            const authToken = resToken.body.token;

            const post = new Post({
                userId: authUser._id.toString(),
                title: 'Test Post',
                desc: 'This is a test post',
                createdAt: new Date()
            });
            await post.save();

            const resComment = await chai.request(app)
                .post(`/api/comment/${post._id}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({ comment: 'This is a test comment' });

            expect(resComment).to.have.status(200);
            expect(resComment.body).to.have.property('commentId');

            const createdComment = await Comment.findById(resComment.body.commentId);
            expect(createdComment).to.have.property('text', 'This is a test comment');
            expect(createdComment).to.not.be.null;

            const updatedPost = await Post.findById(post._id);
            expect(updatedPost.comments).to.include(createdComment.text);

            await User.deleteOne({ _id: authUser._id });
            await Post.deleteOne({ _id: post._id });
            await Comment.deleteOne({ _id: createdComment._id }); 
        }).timeout(50000);
    });
});

describe('Get User Post Endpoint', () => {
    it('should return the number of likes and comments for a post', async () => {
        const user = new User({
            email: 'testuser@gmail.com',
            password: 'password123'
        });
        await user.save();

        const post = new Post({
            userId: user._id,
            title: 'Test Post',
            desc: 'This is a test post',
            comments: ['C1', 'C2'],
            likes: ['U1', 'U2'],
            createdAt: new Date()
        });
        await post.save();

        const resToken = await chai
            .request(app)
            .post('/api/authenticate')
            .send({ email: 'testuser@gmail.com', password: 'password123' });

        const authToken = resToken.body.token;
        const res = await chai
            .request(app)
            .get(`/api/posts/${post._id}`)
            .set('Authorization', `Bearer ${authToken}`);

        expect(res).to.have.status(200);
        expect(res.body).to.deep.equal({
            numberOfLikes: 2,
            numberOfComments: 2
        });

        await User.deleteOne({ _id: user._id });
        await Post.deleteOne({ _id: post._id });
    }).timeout(50000);
});