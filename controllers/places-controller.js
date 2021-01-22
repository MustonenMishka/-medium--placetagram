const {validationResult} = require('express-validator');
const mongoose = require('mongoose');
const fs = require('fs');

const HttpError = require('../models/http-error');
const getCoordsFromAddress = require('../util/location');
const Place = require('../models/place');
const User = require('../models/user');
const cloudinary = require('../config/cloudinary-config');

const getPlaceById = async (req, res, next) => {
    const placeId = req.params.placeId;

    let foundedPlace;
    try {
        foundedPlace = await Place.findById(placeId)
    } catch (e) {
        return next(new HttpError('Error during finding place', 500))
    }

    if (!foundedPlace) {
        return next(new HttpError('Could not find a place with that place ID', 404));
    }

    res.json({place: foundedPlace.toObject({getters: true})});
};

const getPlacesByUserId = async (req, res, next) => {
    const userId = req.params.userId;

    let userOfPlaces;
    try {
        userOfPlaces = await User.findById(userId).populate('places')
    } catch (e) {
        return next(new HttpError('Error during finding user', 500))
    }
    if (!userOfPlaces) {
        return next(new HttpError('Could not find places for that user ID', 404));
    }

    res.json({places: userOfPlaces.places.map(place => place.toObject({getters: true}))});
};

const createPlace = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs, try again', 422))
    }

    const {title, description, address} = req.body;
    let coordinates;
    try {
        coordinates = await getCoordsFromAddress(address);
    } catch (e) {
        return next(e)
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

    const createdPlace = new Place({
        title, description, address,
        image: imageUrl,
        location: coordinates,
        creator: req.userData.userId
    });

    let user;
    try {
        user = await User.findById(req.userData.userId);
    } catch (e) {
        return next(new HttpError('Error during finding user', 500))
    }
    if (!user) {
        return next(new HttpError('Could not find user with this ID', 404));
    }

    try {
        const session = await mongoose.startSession();
        session.startTransaction();
        await createdPlace.save({session});
        user.places.push(createdPlace);
        await user.save({session});
        await session.commitTransaction()
    } catch (e) {
        return next(new HttpError('Creating place failed', 500))
    }

    res.status(201).json({place: createdPlace})
};

const updatePlaceById = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return next(new HttpError('Invalid inputs, try again', 422))
    }

    const placeId = req.params.placeId;
    let foundedPlace;
    try {
        foundedPlace = await Place.findById(placeId)
    } catch (e) {
        return next(new HttpError('Error during finding place', 500))
    }

    if (foundedPlace.creator.toString() !== req.userData.userId) {
        return next(new HttpError('You are not authorized to edit this place', 401))
    }

    const {title, description} = req.body;
    foundedPlace.title = title;
    foundedPlace.description = description;

    try {
        await foundedPlace.save()
    } catch (e) {
        return next(new HttpError('Error during saving updated place', 500))
    }

    res.json({place: foundedPlace.toObject({getters: true})});
};

const deletePlace = async (req, res, next) => {
    const placeId = req.params.placeId;

    let foundedPlace;
    try {
        foundedPlace = await Place.findById(placeId).populate('creator')
    } catch (e) {
        return next(new HttpError('Error during finding place', 500))
    }
    if (!foundedPlace) {
        return next(new HttpError('Could not find place with this ID', 404));
    }

    if (foundedPlace.creator.id !== req.userData.userId) {
        return next(new HttpError('You are not authorized to delete this place', 401))
    }

    const imagePath = foundedPlace.image;

    try {
        const session = await mongoose.startSession();
        session.startTransaction();
        await foundedPlace.remove({session});
        foundedPlace.creator.places.pull(foundedPlace);
        await foundedPlace.creator.save({session});
        await session.commitTransaction()
    } catch (e) {
        return next(new HttpError('Error during deleting place', 500))
    }

    fs.unlink(imagePath, err => {
        console.log(err)
    })

    res.status(200).json({message: 'Deleted place'})
};

exports.getPlacebyId = getPlaceById;
exports.getPlacesbyUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlaceById = updatePlaceById;
exports.deletePlace = deletePlace;