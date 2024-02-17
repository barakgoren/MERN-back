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


app.use(bodyParser.json());
app.use(cors({
    origin: true,
    credentials: true
}));
app.use(cookieParser());
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