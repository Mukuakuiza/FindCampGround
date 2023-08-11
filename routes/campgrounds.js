const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const campgrounds = require('../controllers/campgrounds')
const {isLoggedIn,isAuthor, validateCampground} = require('../middleware');
const multer = require('multer')
const {storage} = require('../cloudinary')
const upload = multer({storage})


//shows all the campgrounds
router.get('/',catchAsync(campgrounds.index));

//form to create a new campground
router.get('/new', isLoggedIn, campgrounds.renderNewForm);

 //where the forms submit the info of created campground
router.post('/', isLoggedIn, upload.array('image'), validateCampground,  catchAsync(campgrounds.createCampground))

// router.post('/', upload.array('image'), (req,res)=>{
//     console.log(req.body, req.files)
//     res.send('worked')
// })

//shows individual campground
router.get('/:id', catchAsync(campgrounds.showCampground));

//edit page or update 
router.get('/:id/edit',isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))

//where edit submit or updated
router.put('/:id',isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground))

//delete campground
router.delete('/:id',isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))

module.exports = router;