const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const UserModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
const { genToken, isAdmin, isAuth } = require('../utils/auth');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Use the original file extension
    },
});
const upload = multer({ storage: storage });


//--------------------------------------- Gets -----------------------------------------------------
router.get('/', isAdmin, (req, res) => {
    UserModel
        .find()
        .then(result => res.status(200).json(result))
        .catch(err => res.status(404).json(err))
})

router.get('/byid/:id', isAuth, (req, res) => {
    UserModel
        .findById(req.params.id)
        .then(result => res.status(200).json(result))
        .catch(err => res.status(404).json(err))
})

router.get('/name/:name', isAuth, (req, res) => {
    UserModel
        .find({ name: req.params.name })
        .then(result => res.status(200).json(result))
        .catch(err => res.status(404).json(err))

})

router.get('/me', isAuth, (req, res) => {
    UserModel
        .findById(req.userId)
        .then(result => res.status(200).json(result))
        .catch(err => res.status(404).json(err))
});


//--------------------------------------- Posts -----------------------------------------------------
router.post('/login', async (req, res) => {
    try {
        const user = await UserModel.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const isMatch = await bcrypt.compare(req.body.password.toString(), user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid password' });
        }
        let token = genToken(user._id);
        console.log("Token Generated: ", token);
        return res.status(200).json({ token: token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/logout', (req, res) => {
    res.clearCookie('access-token', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        // If you initially set a domain, you need to specify it here as well
        // domain: '.yourdomain.com'
    }); console.log(req.cookies['access-token']);
    res.status(200).json({ message: 'Logged out' });
});

router.post('/', upload.single('file'), async (req, res) => {
    req.body.password = await bcrypt.hash(req.body.password.toString(), 8);
    const user = new UserModel(req.body);
    if (!req.file.filename) {
        user.image = 'default.jpg';
    } else {
        user.image = req.file.filename;
    }
    console.log(user);
    user.save()
        .then(result => res.status(200).json(result))
        .catch(err => {
            console.log(err);
            res.status(401).json(err)
        });
})

// Post for creating new post
router.post('/post', isAuth, (req, res) => {
    UserModel
        .findById(req.userId)
        .then(user => {
            user.posts.push(req.body);
            user.save()
                .then(result => res.status(200).json(result))
                .catch(err => res.status(404).json(err))
        })
        .catch(err => res.status(404).json(err))
})


module.exports = router;
