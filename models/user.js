const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

//username and password is not specified on Schema as the
// passportLocalMongoose will take care of them
const UserSchema = new Schema({
    email:{
        type: String,
        required: true,
        unique: true
    }
});

UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', UserSchema);

