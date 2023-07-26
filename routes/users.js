const express = require('express')
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const passport = require('passport');

//register -form show
router.get('/register', (req,res)=>{
    res.render('users/register')
})

//post register- create a user(where the register form submits)
router.post('/register', catchAsync( async(req, res, next)=>{
    try{
        const {email, username, password} = req.body;
        const user = new User({email, username});
        const registeredUser = await User.register(user, password);

        //using a passport method login to login user after register
        req.login(registeredUser, err =>{
            if(err) return next(err);
            req.flash('success', 'Welcome to Yatena Camp!');
            res.redirect('/campgrounds')
        })
    }catch(e){
        req.flash('error', e.message)
        res.redirect('register')
    }
   
}))


//login serves the form or show the form
router.get('/login', (req,res)=>{
    res.render('users/login')
})

//submit the login form
router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), (req,res)=>{
    req.flash('success', 'Welcome back!')
    res.redirect('/campgrounds')
})

router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
}); 

module.exports = router;