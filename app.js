const express = require('express');
const app = express();
const mongoose = require('mongoose');
const port = 3001;
const userRouter = require('./routs/userRouter');
const productRouter = require('./routs/productRouter');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');


app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use('/users', userRouter);
app.use('/products', productRouter);

app.listen(port, '0.0.0.0', () => {
    console.log("Server Started");
    mongoose.connect('mongodb://localhost:27017/SkinderApp')
        .then(() => console.log("MongoDB Connected"));
})