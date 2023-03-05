const express = require('express');
const mongoose = require('mongoose');
const app = express();
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
//const User = require('./models/usermodel.js');
dotenv.config({ path: './config.env' });

require('./db/connection.js');

app.use(express.json());
//link the router files 
app.use(require('./router/auth.js'));

const PORT = process.env.PORT;

app.use(cookieParser());



//Middleware
// const middleware = (req, res, next) => {
//     console.log('hello my middle ware');
//     next();
// }


// respond with "hello world" when a GET request is made to the homepage
// app.get('/', (req, res) => {
//     res.send('hello world')
// });

// app.get('/about', (req, res) => {
//     res.send('This is about us page');
// });

app.get('/register', (req, res) => {
    res.send('This is register page');
});
app.get('/signin', (req, res) => {
    res.send('This is login page');
});
app.get('/contact', (req, res) => {
    res.send('This is a contact us page');
});






app.listen(PORT, () => {
    console.log(`server is running at port no ${PORT}`);
})