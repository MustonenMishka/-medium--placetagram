const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { type: String, required: true },
    password: { type: String, required: true, minlength: 3 },
    about: { type: String, required: true, minlength: 5 },
    email: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    places: [{type: mongoose.Types.ObjectId, required: true, ref: 'Place'}]
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);