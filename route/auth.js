const express = require('express');
const router = express.Router();
const md5 = require('md5')
const jwt = require('jsonwebtoken');
const verifyToken = require('../middleware/auth');
const User = require('../model/user');

//@route Get /
//@desc Check Token
//@access Public

router.get('/',verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password')
        if(!user) return res.status(400).json({success: false, message: 'User not found1'})
        return res.json({success: true, user})
    } catch (error) {
        console.log(error)
        return res
        .status(500)
        .json({success: false, message: "Internal server error"});
    }
})

//@route POST api/auth/register
//@desc Register User
//@access Public

router.post('/register', async (req, res) => {
    const {username, password} = req.body;

    // simple validation

    // Check null username and password
    if(!username || !password) {
        return res
        .status(400)
        .json({success: false, message: 'Mising username and/or password'});
    }
    try {
        //Check existing user
        const user = await User.findOne({username});
        if(user) {
            return res
            .status(400)
            .json({success: false, message: 'User already taken'});
        }
        // All good
        const hashedPassword = await md5(password);
        const newUser = new User({username, password: hashedPassword});
        await newUser.save();

        // Return token

        const token = jwt.sign({userId: newUser._id}, process.env.ACCESS_TOKEN_SECRET);
        return res.json({success: true, message: 'User registed', token: token});
    } catch (error) {
        console.log(error);
        return res
        .status(500)
        .json({success: false, message: "Internal server error"});
    }
});

//@route POST api/auth/login
//@desc Login User
//@access Public

router.post('/login', async (req, res) => {
    const {username, password} = req.body;
    //Simple validation
    if(!username || !password) {
        return res
        .status(400)
        .json({success: false, message: "Username or password is null"});
    }
    try {
        const user = await User.findOne({username});
        if(!user) {
            return res
            .status(400)
            .json({success: false, message: "User not found"});
        }
        
        if(user.password !== md5(password)) {
            return res
            .status(400)
            .json({success: false, message: "Wrong Pasword"});
        }
        const token = jwt.sign({userId: user._id}, process.env.ACCESS_TOKEN_SECRET);
        return res.json({success: true, message: 'Login successfully', token});
    } catch (error) {
        console.log(error);
        return res
        .status(500)
        .json({success: false, message: "Internal server error"});
    }
    
});

module.exports = router;