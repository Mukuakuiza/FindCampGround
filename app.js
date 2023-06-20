//connect to express
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const ejsMate =require('ejs-mate');
const {campgroundSchema, reviewSchema} = require('./schemas.js')
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/expressError')
const Campground = require('./models/campground');
const methodOverride = require('method-override');
const path = require('path')
const Review = require('./models/review')

//getting the router from the routes folder
const campgrounds = require('./routes/campgrounds')

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/Yatena-Camp');
  console.log("Mongoose connection open!!");
}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', ejsMate);
app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))//used to override method get or post when submit the edit form



const validateReview =(req,res,next)=>{
  const {error} = reviewSchema.validate(req.body);
  if(error){
    const msg = error.details.map(el => el.message).join(',')
    throw new ExpressError(msg, 400)
  }else{
    next()
  }
}


//using the routes with path prefix 
app.use('/campgrounds', campgrounds)
app.get('/', (req,res)=>{
 res.render('home')
})



//review
app.post('/campgrounds/:id/reviews', validateReview, catchAsync(async(req,res)=>{
  const campground = await Campground.findById(req.params.id);
  const review = new Review (req.body.review);
  campground.reviews.push(review);
  await review.save();
  await campground.save();
  res.redirect(`/campgrounds/${campground._id}`)
}))


//delete reviews 
app.delete('/campgrounds/:id/reviews/:reviewId', catchAsync( async(req, res)=>{
   const {id, reviewId} = req.params;
   await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
   await Review.findByIdAndDelete(reviewId)
   res.redirect(`/campgrounds/${id}`)
}))

app.all('*', (req,res,next)=>{
  next(new ExpressError('Page Not Found', 404))
})

//next error message
app.use((err,req,res,next)=>{
  const {statusCode = 500} = err;
  if(!err.message) err.message = 'Sorry, something went wrong!' 
  res.status(statusCode).render('error', {err});
})
//running port
app.listen(3000, ()=>{
    console.log('Listening on port 3000!!!');
})