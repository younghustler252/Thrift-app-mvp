const generateToken = require('../utils/generateToken');
const User = require('../models/User');
const asyncHandler = require('express-async-handler')

// @desc    Register new user
// @route   POST /api/users/register
// @access  Public


const registerUser = asyncHandler(async (req, res) => {
    const {name , email , password} = req.body;

    if (!name || !email || !password) {
        return res.status(400);   
        throw new Error("Please provide name, email, and password");
          
    }

    const userExist = await User.findOne({email});

    if (userExist) {
        res.status(400)
        throw new Error("User already exists");
    }

    const user = await User.create({
        name,
        email,
        password
    })

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id)
        })
    } else{
        res.status(400);
        throw new Error('invalid user data')
    }
})
// @desc    Authenticate user & get token
// @route   POST /api/users/login
// @access  Publ

const loginUser = asyncHandler(async (req, res) => {
    const {email, password} = req.body;
    if (!email || !password) {
        return res.status(400)
        throw new Error("Please provide email and password");
        
    }
        

    const user = await User.findOne({email});

    if (user && (await user.matchPassword(password))) {
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id)
        })
    } else {
        return res.status(401)
        throw new Error("Invalid email or password");
        
    }
})


module.exports = {registerUser, loginUser};