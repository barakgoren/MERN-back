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
const upload = multer({ storage: storage});


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

router.post('/', upload.single('file'), async (req, res) => {
    req.body.password = await bcrypt.hash(req.body.password.toString(), 8);
    const user = new UserModel(req.body);
    user.image = req.file.filename;
    console.log(user);
    user.save()
        .then(result => res.status(200).json(result))
        .catch(err => {
            console.log(err);
            res.status(401).json(err)
        });
})

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
        return res.status(200).cookie('access-token', token, { httpOnly: true, maxAge: 15 * 24 * 60 * 60 * 1000 }).json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/me', isAuth, (req, res) => {
    UserModel
        .findById(req.userId)
        .then(result => res.status(200).json(result))
        .catch(err => res.status(404).json(err))
});


module.exports = router;
