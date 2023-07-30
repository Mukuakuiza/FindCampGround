const {campgroundSchema, reviewSchema} = require('./schemas.js')
const ExpressError = require('./utils/expressError')
const { ref } = require('joi');
const Campground = require('./models/campground')
//authentication middleware
//isauthenticated is a passport function that checks if you are authenticated
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        // req.session.returnTo = req.originalUrl; 
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}

//joi middleware
module.exports.validateCampground = (req, res, next)=>{
    const {error}  = campgroundSchema.validate(req.body);
    if(error){
      const msg = error.details.map(el => el.message).join(',')
      throw new ExpressError(msg, 400)
    }else{
      next()
    }
}

//campground permission middleware
module.exports.isAuthor = async(req,res, next)=>{
  const {id} = req.params
   //check if the campground have not the same user id with author id
   const campground = await Campground.findById(id);
   if(!campground.author.equals(req.user._id)){
     req.flash('error', 'You do not have permission to do that');
     return res.redirect(`/campgrounds/${id}`);
   }
   next();
}

//is used to save the returnTo value from the session (req.session.returnTo) to res.locals
module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}


//validate review middleware


module.exports.validateReview =(req,res,next)=>{
    const {error} = reviewSchema.validate(req.body);
    if(error){
      const msg = error.details.map(el => el.message).join(',')
      throw new ExpressError(msg, 400)
    }else{
      next()
    }
  }