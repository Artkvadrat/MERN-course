const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const User = require('../models/user');

const getAllUsers = async (req, res, next) => {

    let users;

    try {
        users = await User.find({}, '-password');
    } catch (err) {
        const error = new HttpError(`Couldn\'t find users. Check your data. ${err}`, 500);
        return next(error);
    }

    res.json({users: users.map( user => user.toObject({ getters: true }) )});
}

const login = async (req, res, next) => {

    const isDataValid = validationResult(req);

    if (!isDataValid.isEmpty()) {
        let errorParams = '';
        isDataValid.errors.map(item => errorParams+=item.param + ' ')
        return next (
            new HttpError(`Could add the place. Invalid inputs. Check ${errorParams} param`, 422)
        )
    }

    const {email, password} = req.body;

    let authorizedUser;
    try {
        authorizedUser = await User.findOne({ email: email })
    } catch (err) {
        const error = new HttpError(`Couldn\'t login. Try again later. ${err}`, 500);
        return next(error);
    }

    if (!authorizedUser || authorizedUser.password !== password) {
        const error = new HttpError(`Invalid credentials, could not log you in.`, 401);
        return next(error);
    }

    res.status(200).json({message: 'Logged in!'});
}

const signup = async (req, res, next) => {

    const isDataValid = validationResult(req);

    if (!isDataValid.isEmpty()) {
        let errorParams = '';
        isDataValid.errors.map(item => errorParams+=item.param + ' ')
        return next (
            new HttpError(`Could add the user. Invalid inputs. Check ${errorParams} param`, 422)
        )
    }

    const { name, email, password } = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({ email: email });
    } catch (err) {
        const error = new HttpError(`Signing up failed. Try again ${err}`, 500);
        return next(error);
    }

    if (existingUser) {
        const error = new HttpError('User is already exists, please login instead', 422);
        return next(error);
    }

    const createdUser = new User({
        name,
        email,
        image: 'https://images.pexels.com/photos/1933873/pexels-photo-1933873.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
        password,
        places: []
    })

    try {
        await createdUser.save();
    } catch (err) {
        const error = new HttpError(
            `Creating user failed. Pls try again. ${err}`,
            500
        );
        return next(error);
    }

    res.status(201).json({user: createdUser.toObject({ getters: true })});
}

exports.getAllUsers = getAllUsers;
exports.signup = signup;
exports.login = login;