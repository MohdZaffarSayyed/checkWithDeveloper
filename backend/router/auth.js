const { json } = require('express');
const express = require('express');
const User = require('../models/usermodel.js');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authenticate = require('../middleware/authenticate');
const cookieParser = require('cookie-Parser');
require('../db/connection.js');

router.use(cookieParser());
router.get('/', (req, res) => {
    res.send('hello world this is main page')
});


//using promises or without async await
// router.post('/register', (req, res) => {

//     const { name, email, phone, work, password, cpassword } = req.body;

//     if (!name || !email || !phone || !work || !password || !cpassword) {
//         return res.status(422).json({ error: "Please complete the fields" });
//     }


//     User.findOne({ email: email })
//         .then((userExist) => {
//             if (userExist) {
//                 return res.status(422).json({ error: "The email is alredy registered please select a different email" });
//             }

//             const user = new User({ name, email, phone, work, password, cpassword });

//             user.save().then(() => {
//                 res.status(201).json({ message: "User registered Successfully" });
//             }).catch((err) => res.status(500).json({ error: "Failed register!!" }))
//         }).catch(err => { console.log(err); });

//     // console.log(email);
//     // console.log(name);
//     // res.json({ message: req.body });

// });


//Async Await

router.post('/register', async(req, res) => {

    const { name, email, phone, work, password, cpassword } = req.body;

    if (!name || !email || !phone || !work || !password || !cpassword) {
        return res.status(422).json({ error: "Please complete the fields" });
    }

    try {

        const userExist = await User.findOne({ email: email })

        if (userExist) {

            return res.status(422).json({ error: "The email is alredy registered please select a different email" });
        } else if (password != cpassword) {
            res.status(400).json({ error: "password does not match!" });
        } else {
            const user = new User({ name, email, phone, work, password, cpassword });

            await user.save();

            res.status(201).json({ message: "User registered Successfully" });
        }



    } catch (err) {
        console.log(err);
    }



    // console.log(email);
    // console.log(name);
    // res.json({ message: req.body });

});



//login route

router.post('/signin', async(req, res) => {

    // console.log(req.body);
    // res.json({ message: "awesome" })

    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(422).json({ error: "Please complete the fields" });
        }

        const userLogin = await User.findOne({ email: email });

        //console.log(userLogin);

        if (userLogin) //if the email ID not found
        {
            const isMatch = await bcrypt.compare(password, userLogin.password);


            const token = await userLogin.generateAuthToken();
            console.log(token);

            res.cookie("jwtToken", token, {
                expires: new Date(Date.now() + 2589200000),
                httpOnly: true
            });

            if (!isMatch) {
                res.status(400).json({ error: "User credentials error! Please check the credentials again" });
            } else {
                res.json({ message: "Logged in Successfully" });

            }

        } else {
            res.status(400).json({ error: "User credentials error! Please check the credentials again" });
        }



    } catch (err) {
        console.log(err);
    }
});

//about us 

router.get('/about', authenticate, (req, res) => {
    res.send('This is about us page');
});


//getUserData 

router.get('/getData', authenticate, (req, res) => {
    res.send(req.rootUser);
});

//Logout page

router.get('/logout', (req, res) => {
    res.clearCookie('jwtToken', { path: '/' });
    res.status(200).send('user Logout');
});


module.exports = router;