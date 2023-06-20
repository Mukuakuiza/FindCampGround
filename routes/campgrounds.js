const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const {campgroundSchema, reviewSchema} = require('../schemas.js')
const ExpressError = require('../utils/expressError')
const Campground = require('../models/campground');


//joi middleware
const validateCampground = (req, res, next)=>{
    const {error}  = campgroundSchema.validate(req.body);
    if(error){
      const msg = error.details.map(el => el.message).join(',')
      throw new ExpressError(msg, 400)
    }else{
      next()
    }
}

//shows all the campgrounds
router.get('/',catchAsync( async (req,res)=>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});
}));

//form to create a new campground
router.get('/new', (req, res) => {
  res.render('campgrounds/new');

 });

 //where the forms submit the info
router.post('/', validateCampground, catchAsync( async(req,res, next)=>{
  // if(!re.body.campground) throw new ExpressError('Invalid Campground data', 400);
    const campground = new Campground(req.body.campground)
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
  }))

//shows individual campground
router.get('/:id',catchAsync( async(req, res)=>{
  const campground = await Campground.findById(req.params.id).populate('reviews');
  res.render('campgrounds/show', {campground})
}));

//edit page
router.get('/:id/edit',catchAsync( async(req, res)=>{
  const campground = await Campground.findById(req.params.id);
  res.render('campgrounds/edit', {campground});
}))

//where edit submit
router.put('/:id',validateCampground, catchAsync( async(req,res)=>{
  const {id} = req.params
  const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground});
  res.redirect(`/campgrounds/${campground._id}`)
}))

//delete campground
router.delete('/:id',catchAsync( async(req, res)=>{
  const {id} = req.params;
  await Campground.findByIdAndDelete(id);
  res.redirect('/campgrounds')
}))

module.exports = router;