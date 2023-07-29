const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;


//creating model schema
const CampgroundSchema = new Schema({
    title: String,
    images: String,
    price: Number,
    description: String,
    location: String,
    author: {type: Schema.Types.ObjectId, ref: 'User'},
    reviews: [
        {type: Schema.Types.ObjectId, ref: 'Review'}
    ]
});

//deleting campground and reviews together 
CampgroundSchema.post('findOneAndDelete', async function(doc){
    if (doc) {
        await Review.deleteMany({
            _id:{
                $in:doc.reviews
            }
        })
    }
})


//Model name = campground and schema = campgroundSchema
module.exports = mongoose.model('Campground', CampgroundSchema);