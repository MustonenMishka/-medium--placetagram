const express = require('express');
const {check} = require('express-validator');

const usersControllers = require('../controllers/users-controller');
const multerUploads = require('../middleware/multer');

const router = express.Router();

router.get('/', usersControllers.getUsers);

router.post(
    '/signup',
    multerUploads.single("image"),
    [
        check('name').not().isEmpty(),
        check('email').normalizeEmail().isEmail(),
        check('password').isLength({min: 5})
    ],
    usersControllers.createUser);

router.post('/login', usersControllers.loginUser);

module.exports = router