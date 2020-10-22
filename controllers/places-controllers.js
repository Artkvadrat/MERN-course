const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const getCoordsForAddress = require('../util/location');

const Place = require('../models/place');
const User = require('../models/user');

const getPlaceByID = async (req, res, next) => {
    const placeId = req.params.pid;
    let place;

    try {
        place = await Place.findById(placeId);
    } catch (err) {
        const error = new HttpError(
            `Couldn\'t find place. ${err}`,
            500
        );
        return next(error)
    }


    if (!place) {
        return next (
            new HttpError(`Could not find place for the provided id.`, 404)
        )
    }

    res.json({place: place.toObject({ getters: true }) });
}

const getPlacesByUserId = async (req, res, next) => {
    const userID = req.params.uid;

    let userWithPlaces;
    try {
        userWithPlaces = await User.findById(userID).populate('places');
    } catch (err) {
        return next (
            new HttpError(`Could not find places for the provided id. ${err}`, 500)
        )
    }

    if (!userWithPlaces || userWithPlaces.places.length === 0) {
        return next (
            new HttpError('Could not find places for the provided id', 404)
        )
    }

    res.json({ places: userWithPlaces.places.map( item => item.toObject({ getters: true }) ) });
}

const createPlace = async (req, res, next) => {
    const isDataValid = validationResult(req);

    if (!isDataValid.isEmpty()) {
        let errorParams = '';
        isDataValid.errors.map(item => errorParams+=item.param + ' ')
        return next (
            new HttpError(`Could add the place. Invalid inputs. Check ${errorParams}param`, 422)
        )
    }

    const { title, description, coordinates, address, creator } = req.body;

    let coordinate = getCoordsForAddress(coordinates);

    const createdPlace = new Place({
        title,
        description,
        address,
        location: coordinate,
        image: 'https://images.pexels.com/photos/2404949/pexels-photo-2404949.jpeg?cs=srgb&dl=pexels-chethan-prabhu-2404949.jpg&fm=jpg',
        creator
    });

    let user;
    try {
        user = await User.findById(creator);
    } catch (err) {
        const error = new HttpError(`Creating place failed. Try again later. ${err}`, 500);
        return next(error);
    }

    if (!user) {
        const error = new HttpError(
            'Could not find a user by provided id.',
            404
        );
        return next(error);
    }

    console.log(user);

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await createdPlace.save({ session: sess });
        user.places.push(createdPlace);
        await user.save({ session: sess });
        await sess.commitTransaction();
    } catch (err) {
        const error = new HttpError(`Creating place failed. Pls try again. ${err}`, 500);
        return next(error);
    }

    res.status(201).json({place: createdPlace.toObject({getters: true})});
}

const updatePlace = async (req, res, next) => {
    const isDataValid = validationResult(req);
    if (!isDataValid.isEmpty()) {
        let errorParams = '';
        isDataValid.errors.map(item => errorParams+=item.param + ' ')
        return next (
            new HttpError(`Could add the place. Invalid inputs. Check ${errorParams} param`, 422)
        )
    }

    const { title, description } = req.body;
    const placeId = req.params.pid;

    let place;

    try {
        place = await Place.findById(placeId);
    } catch (err) {
        const error = new HttpError(`Can\'t find place by id. ${err}`, 500);
        return next(error);
    }

    place.title = title;
    place.description = description;

    try {
        await place.save();
    } catch (err) {
        const error = new HttpError(`Can\'t update place. ${err}`, 500);
        return next(error);
    }

    res.status(200).json({ place: place.toObject({ getters: true }) });
}

const deletePlace = async (req, res, next) => {
    const placeId = req.params.pid;

    let place;
    try {
        place = await Place.findById(placeId).populate('creator');
    } catch (err) {
        const error = new HttpError(`Can\'t find place by id. ${err}`, 500);
        return next(error);
    }

    if (!place) {
        const error = new HttpError('Can\'t find place by id', 404);
        return next(error);
    }

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await place.remove({session: sess});
        place.creator.places.pull(place);
        await place.creator.save({session: sess});
        await sess.commitTransaction();
    } catch (err) {
        const error = new HttpError(`Can\'t delete place by id ${err}`, 500);
        return next(error);
    }

    res.status(200).json({message: 'Deleted place.'});
}

exports.getPlaceByID = getPlaceByID;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;