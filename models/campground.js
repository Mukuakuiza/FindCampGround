const mongoose = require('mongoose');
const Schema = mongoose.Schema;


//creating model schema
const CampgroundSchema = new Schema({
    title: String,
    price: String,
    description: String,
    location: String
});

//Model name = campground and schema = campgroundSchema
module.exports = mongoose.model('Campground', CampgroundSchema);