//authentication middleware
//isauthenticated is a passport function that checks if you are authenticated
const isLoggedIn = (req, res, next)=>{
    if (!req.isAuthenticated()) {
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }

    next();
} 
module.exports = isLoggedIn;