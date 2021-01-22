const express = require('express');
const {check} = require('express-validator');

const placesControllers = require('../controllers/places-controller');
const multerUploads = require('../middleware/multer');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.get('/:placeId', placesControllers.getPlacebyId);

router.get('/user/:userId', placesControllers.getPlacesbyUserId);

router.use(checkAuth);

router.post('/',
    multerUploads.single("image"),
    [
        check('title').not().isEmpty(),
        check('description').isLength({min: 5}),
        check('address').not().isEmpty(),
    ],
    placesControllers.createPlace);

router.patch('/:placeId',
    [
        check('title').not().isEmpty(),
        check('description').isLength({min: 5})
    ],
    placesControllers.updatePlaceById);

router.delete('/:placeId', placesControllers.deletePlace);

module.exports = router;