const Joi = require('joi')

//schema from joi will validate our data before even attempt to save in mongo
//campground validation 
module.exports.campgroundSchema  = Joi.object({
  campground: Joi.object({
    title: Joi.string().required(),
    price: Joi.number().required().min(0),
    // images: Joi.string().required(),
    location: Joi.string().required(),
    description: Joi.string().required(),
  }).required()
})

//validation for review
module.exports.reviewSchema = Joi.object({
  review:Joi.object({
    rating: Joi.number().required().min(1).max(5),
    body: Joi.string().required()
  }).required()
})