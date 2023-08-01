const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const {isLoggedIn,isAuthor, validateCampground} = require('../middleware');




//shows all the campgrounds
router.get('/',catchAsync( async (req,res)=>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});
}));

//form to create a new campground
router.get('/new', isLoggedIn, (req, res) => {
  res.render('campgrounds/new');

 });

 //where the forms submit the info of created campground
router.post('/', isLoggedIn, validateCampground, catchAsync( async(req,res, next)=>{
  // if(!re.body.campground) throw new ExpressError('Invalid Campground data', 400);
    const campground = new Campground(req.body.campground)

    //passing the user id to be the author 
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully created new campground!')
    res.redirect(`/campgrounds/${campground._id}`)
  }))

//shows individual campground
router.get('/:id', catchAsync( async(req, res)=>{
  const campground = await Campground.findById(req.params.id).populate({path:'reviews', populate: {path: 'author'}}).populate('author');
  if(!campground){
    req.flash('error', 'Sorry, cannot find campground')
    return res.redirect('/campgrounds')
  }
  res.render('campgrounds/show', {campground})
}));

//edit page or update 
router.get('/:id/edit',isLoggedIn, isAuthor, catchAsync( async(req, res)=>{
  const {id} = req.params
  const campground = await Campground.findById(id);
  if(!campground){
    req.flash('error', 'Sorry, cannot find campground')
    return res.redirect('/campgrounds')
  }
  res.render('campgrounds/edit', {campground});
}))

//where edit submit or updated
router.put('/:id',isLoggedIn, isAuthor, validateCampground, catchAsync( async(req,res)=>{
  const {id} = req.params;
  const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground});
  req.flash('success', 'Successfully updated campground!')
  res.redirect(`/campgrounds/${campground._id}`)
}))

//delete campground
router.delete('/:id',isLoggedIn, isAuthor, catchAsync( async(req, res)=>{
  const {id} = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash('success', 'Successfully deleted campground!')
  res.redirect('/campgrounds')
}))

module.exports = router;