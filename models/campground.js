const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;


//creating image schema for allowing thumbnail
const ImageSchema = new Schema({
    url: String,
    filename: String
})

ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload', '/upload/w_200');
})

//creating model schema
const CampgroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
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