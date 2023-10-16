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

const opts = {toJSON: {virtuals: true}};

//creating model schema
const CampgroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
    geometry:{
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      },
    price: Number,
    description: String,
    location: String,
    author: {type: Schema.Types.ObjectId, ref: 'User'},
    reviews: [
        {type: Schema.Types.ObjectId, ref: 'Review'}
    ]
}, opts);

CampgroundSchema.virtual('properties.popUpMarkup').get(function(){
    return `<a href="/campgrounds/${this._id}">${this.title}</a>`;
})

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