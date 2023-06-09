const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const {campgroundSchema, reviewSchema} = require('../schemas.js')
const ExpressError = require('../utils/expressError')
const Campground = require('../models/campground');
const { ref } = require('joi');


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
    req.flash('success', 'Successfully created new campground!')
    res.redirect(`/campgrounds/${campground._id}`)
  }))

//shows individual campground
router.get('/:id',catchAsync( async(req, res)=>{
  const campground = await Campground.findById(req.params.id).populate('reviews');
  if(!campground){
    req.flash('error', 'Sorry, cannot find campground')
    return res.redirect('/campgrounds')
  }
  res.render('campgrounds/show', {campground})
}));

//edit page or update 
router.get('/:id/edit',catchAsync( async(req, res)=>{
  const campground = await Campground.findById(req.params.id);
  if(!campground){
    req.flash('error', 'Sorry, cannot find campground')
    return res.redirect('/campgrounds')
  }
  res.render('campgrounds/edit', {campground});
}))

//where edit submit or updated
router.put('/:id',validateCampground, catchAsync( async(req,res)=>{
  const {id} = req.params
  const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground});
  re.flash('success', 'Successfully updated campground!')
  res.redirect(`/campgrounds/${campground._id}`)
}))

//delete campground
router.delete('/:id',catchAsync( async(req, res)=>{
  const {id} = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash('success', 'Successfully deleted campground!')
  res.redirect('/campgrounds')
}))

module.exports = router;