const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();
const port = process.env.PORT || 3001;
const userRouter = require('./routs/userRouter');
const productRouter = require('./routs/productRouter');
const postRouter = require('./routs/postRouter');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const allowedOrigins = ['https://barak-social-project.netlify.app', 'https://another-allowed-origin.com'];



app.use(bodyParser.json());
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.use(cookieParser());
// Middleware to log request cookies
app.use((req, res, next) => {
    console.log('Incoming request for:', req.path);
    console.log('Cookies:', req.cookies); // Logs all cookies
    console.log('Access-Token Cookie:', req.cookies['access-token']); // Logs the specific token
    next(); // Proceed to the next middleware or route handler
});

app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use('/users', userRouter);
app.use('/products', productRouter);
app.use('/posts', postRouter);

app.listen(port, '0.0.0.0', () => {
    console.log("Server Started");
    mongoose.connect(`mongodb+srv://${process.env.USER_DB}:${process.env.PASS_DB}@cluster0.frzuroc.mongodb.net/SkinderApp`)
        .then(() => console.log("MongoDB Atlas Connected"));
})