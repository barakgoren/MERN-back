const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: false,
    },
    age: {
        type: Number,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    role: {
        type: Array,
        default: ["User"]
    },
    password: {
        type: String,
        required: true
    }
})

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;