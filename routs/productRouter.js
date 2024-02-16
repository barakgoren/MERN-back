const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const productModel = require('../models/productModel');
const { isAuth, isAdmin } = require('../utils/auth');

router.get('/', (req, res) => {
    productModel
        .find()
        .then(result => res.status(200).json(result))
        .catch(err => res.status(404).json(err))
})

router.post('/', isAdmin, (req, res) => {
    productModel
        .create(req.body)
        .then(result => res.status(200).json({ message: "done" }))
        .catch(err => res.status(401).json(err));
})

router.put('/:id', isAdmin, (req, res) => {
    productModel
        .findByIdAndUpdate(req.params.id, req.body)
        .then(result => res.status(200).json(result))
        .catch(err => res.status(401).json(err));
})

module.exports = router;
