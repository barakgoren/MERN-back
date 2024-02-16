const express = require('express');
const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    stiffnessOutOfTen: {
        type: Number,
        required: true
    },
    shape: {
        type: String,
        required: true
    },
    levelOfExperience: {
        type: Number,
        required: true
    }
})

const productModel = mongoose.model('products', productSchema);

module.exports = productModel;