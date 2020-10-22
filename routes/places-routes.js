const express = require('express');
const { check } = require('express-validator');

const placeControllers = require('../controllers/places-controllers');

const router = express.Router();

const { getPlaceByID, getPlacesByUserId, createPlace, updatePlace, deletePlace } = placeControllers;

router.get('/:pid', getPlaceByID);

router.get('/user/:uid', getPlacesByUserId);

router.post('/',
    [
        check('title').not().isEmpty(),
        check('description').isLength({min: 5}),
        check('address').not().isEmpty()
    ],
    createPlace);

router.patch('/:pid',
    [
        check('title').not().isEmpty(),
        check('description').isLength({min: 5})
    ],
    updatePlace);

router.delete('/:pid', deletePlace);


module.exports = router;