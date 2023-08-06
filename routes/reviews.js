const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const Review = require('../models/review')
const reviews = require('../controllers/reviews')
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware')



//review
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview))
  
  
//delete reviews 
router.delete('/:reviewId',isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReviews))

  module.exports = router;