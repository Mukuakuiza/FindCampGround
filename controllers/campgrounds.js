const Campground = require('../models/campground');
const {cloudinary} = require("../cloudinary")
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken: mapBoxToken})

module.exports.index = async (req,res)=>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.createCampground = async(req,res, next)=>{
    // if(!re.body.campground) throw new ExpressError('Invalid Campground data', 400);

    //using mapbox to get the locations
    const geoData = await geocoder.forwardGeocode({
      query: req.body.campground.location,
      limit: 1
    }).send()
    res.send(geoData.body.features[0].geometry.coordinates)
    // res.send(geoData.body.features[0].geometry.coordinates);

      // const campground = new Campground(req.body.campground)
      // campground.images = req.files.map(file =>({url: file.path, filename: file.filename}))

      // //passing the user id to be the author 
      // campground.author = req.user._id;
      // await campground.save();
      // console.log(campground)
      // req.flash('success', 'Successfully created new campground!')
      // res.redirect(`/campgrounds/${campground._id}`)
    }

module.exports.showCampground = async(req, res)=>{
    const campground = await Campground.findById(req.params.id).populate({path:'reviews', populate: {path: 'author'}}).populate('author');
    if(!campground){
      req.flash('error', 'Sorry, cannot find campground')
      return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', {campground})
  }

module.exports.renderEditForm = async(req, res)=>{
    const {id} = req.params
    const campground = await Campground.findById(id);
    if(!campground){
      req.flash('error', 'Sorry, cannot find campground')
      return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', {campground});
  }

module.exports.updateCampground =async(req,res)=>{
    const {id} = req.params;
    console.log(req.body)
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground});
    const imgs =  req.files.map(file =>({url: file.path, filename: file.filename}));
    campground.images.push(...imgs);
    await campground.save();
    
    //delete image from backend and cloudinary
    if(req.body.deleteImages){

      for(let filename of req.body.deleteImages){
        await cloudinary.uploader.destroy(filename)
      }
      await campground.updateOne({$pull: { images: { filename: {$in: req.body.deleteImages}}}})
    }
    req.flash('success', 'Successfully updated campground!')
    res.redirect(`/campgrounds/${campground._id}`)
  }

module.exports.deleteCampground =async(req, res)=>{
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground!')
    res.redirect('/campgrounds')
  }