const mongoose = require('mongoose');
const dotenv = require('dotenv');

const DBURI = process.env.DBURI;

mongoose.connect(DBURI).then(() => {
    console.log("Database Connection Successful now boom");
}).catch((err) => console.log('connection failed'));