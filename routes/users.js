const express = require('express')
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const passport = require('passport');
const { storeReturnTo } = require('../middleware');
const users = require('../controllers/users')

//register -form show
router.get('/register', users.renderRegister)

//post register- create a user(where the register form submits)
router.post('/register', catchAsync( users.register ))


//login serves the form or show the form
router.get('/login', users.renderLogin)

//submit the login form
// use the storeReturnTo middleware to save the returnTo value from session to res.locals storeReturnTo,
// passport.authenticate logs the user in and clears req.session
router.post('/login', storeReturnTo, passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), users.login)

router.get('/logout', users.logout); 

module.exports = router;