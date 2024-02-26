const express = require('express');
const router = express.Router();
const PostModel = require('../models/postModel');
const { isAuth } = require('../utils/auth');
const UserModel = require('../models/userModel');

//--------------------------------------- Gets -----------------------------------------------------

// GET all posts
router.get('/', async (req, res) => {
    try {
        const posts = await PostModel.find().populate('authorId').sort({ createdAt: -1 });
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//--------------------------------------- Posts -----------------------------------------------------

// CREATE a new post
router.post('/', isAuth, async (req, res) => {
    req.body.authorId = req.userId;
    const post = new PostModel(req.body);

    try {
        const newPost = await post.save();
        const user = await UserModel.findById(req.userId); // fetch the related user
        newPost.authorId = user; // assign the user to the post
        res.status(201).json({ post: newPost, message: 'Post created' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
