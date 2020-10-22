const express = require('express');
const { check } = require('express-validator');

const router = express.Router();

const userControllers = require('../controllers/users-controllers');

const { getAllUsers, login, signup } = userControllers;

router.get('/', getAllUsers);

router.post('/login',
    [
        check('email').isEmail(),
        check('password').isLength({min: 5})
    ],
    login);

router.post('/signup',
    [
        check('name').not().isEmpty(),
        check('email').isEmail(),
        check('password').isLength({min: 5})
    ],
    signup);

module.exports = router;