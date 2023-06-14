const mongoose = require('mongoose');
const review = require('./review');
const Schema = mongoose.Schema;


//creating model schema
const CampgroundSchema = new Schema({
    title: String,
    images: String,
    price: Number,
    description: String,
    location: String,
    reviews: [
        {type: Schema.Types.ObjectId, ref: 'Review'}
    ]
});

//Model name = campground and schema = campgroundSchema
module.exports = mongoose.model('Campground', CampgroundSchema);