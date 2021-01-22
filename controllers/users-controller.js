const {validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const HttpError = require('../models/http-error');
const User = require('../models/user');
const cloudinary = require('../config/cloudinary-config');

const getUsers = async (req, res, next) => {
    const foundUsers = await User.find({}, '-password');
    if (!foundUsers) {
        return next(new HttpError('Can not find any users', 404))
    }
    res.json({users: foundUsers.map(user => user.toObject({getters: true}))});
};

const createUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return next(new HttpError('Invalid inputs, try again', 422))
    }

    const {name, email, password, about} = req.body;

    let foundUser;
    try {
        foundUser = await User.findOne({email: email});
    } catch (e) {
        return next(new HttpError('Signing up failed, try again', 422))
    }
    if (foundUser) {
        return next(new HttpError('User with this email already exists', 422))
    }

    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, 12);
    } catch (e) {
        return next(new HttpError('Could not create user, try again', 500))
    }

    if (!req.file) {
        return next(new HttpError('Error during uploading image', 500))
    }
    let imageUrl;
    try {
        const result = await  cloudinary.uploader.upload(req.file.path);
        imageUrl = result.secure_url;
    } catch (e) {
        return next(new HttpError('Error during uploading image', 500))
    }


    const createdUser = new User({
        name, email, about,
        password: hashedPassword,
        places: [],
        image: imageUrl
    });
    try {
        await createdUser.save()
    } catch (e) {
        return next(new HttpError('Error during saving user', 500))
    }

    let token;
    try {
        token = jwt.sign({userId: createdUser.id, email: createdUser.email},
            process.env.JWT_KEY,
            {expiresIn: '1h'})
    } catch (e) {
        return next(new HttpError('Signing up failed, try again', 500))
    }

    res.json({userId: createdUser.id, email: createdUser.email, token});
};

const loginUser = async (req, res, next) => {
    const {password, email} = req.body;

    let foundUser;
    try {
        foundUser = await User.findOne({email: email});
    } catch (e) {
        return next(new HttpError('Logging in failed, try again', 422))
    }

    if (!foundUser) {
        return next(new HttpError('Invalid credentials, user do not exist', 403))
    }

    let isPasswordValid;
    try {
        isPasswordValid = await bcrypt.compare(password, foundUser.password)
    } catch (e) {
        return next(new HttpError('Could not log you in, try again', 500))
    }

    if (!isPasswordValid) {
        return next(new HttpError('Invalid password', 403))
    }
    let token;
    try {
        token = jwt.sign({userId: foundUser.id, email: foundUser.email},
            process.env.JWT_KEY,
            {expiresIn: '1h'})
    } catch (e) {
        return next(new HttpError('Signing in failed, try again', 500))
    }


    res.json({userId: foundUser.id, email: foundUser.email, token});
};

exports.getUsers = getUsers;
exports.createUser = createUser;
exports.loginUser = loginUser;