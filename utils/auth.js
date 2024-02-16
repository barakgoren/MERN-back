const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

module.exports.secretKey = "BARAKSPROJECT";

module.exports.isAdmin = (req, res, next) => {
    if(!req.headers.cookie) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }
    const token = req.headers.cookie.split('=')[1];
    const decodedToken = jwt.verify(token, module.exports.secretKey);
    userModel.findById(decodedToken._id)
        .then(user => {
            if (user.role.includes('Admin')) {
                next();
            } else {
                res.status(403).json({ message: 'Access denied. You are not an admin.' });
            }
        })
        .catch(err => res.status(500).json({err: "Server Error"}));
};

module.exports.isAuth = (req, res, next) => {
    if(!req.headers.cookie) {
        res.status(401).json({ message: 'Unauthorized1' });
        return;
    }
    const token = req.cookies['access-token'];
    jwt.verify(token, module.exports.secretKey, (err, decoded) => {
        if (err) {
            console.log(err);
            res.status(401).json({ message: 'Unauthorized2' });
        } else {
            req.userId = decoded._id;
            next();
        }
    });
}

module.exports.genToken = (userId) => {
    let token = jwt.sign({ _id: userId }, module.exports.secretKey, { expiresIn: "15 days" });
    return token;
}