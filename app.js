if(process.env.NODE_ENV !== "production"){
  require('dotenv').config();
}

//connect to express
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const ejsMate =require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/expressError')
const methodOverride = require('method-override');
const path = require('path')
const passport = require('passport')
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
// const dbURl = process.env.DB_URL;
app.use(express.static(path.join(__dirname,'public')));
app.use(mongoSanitize())

const sessionConfig={
  name: 'session',
  secret: 'thisshouldbebettersecret!',
  resave: false,
  saveUninitialized: true,
  cookie:{
    httpOnly: true,
    //secure: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}
app.use(session(sessionConfig))
app.use(flash());
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
app.use(helmet());

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dkdapxuii/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

//how to store a user in a session
passport.serializeUser(User.serializeUser());

//how to get user out of session
passport.deserializeUser(User.deserializeUser());

//flash middleware
app.use((req, res, next)=>{
  if(!['/login', '/'].includes(req.originalUrl)){
    req.session.returnTo = req.originalUrl;
  }
  res.locals.currentUser = req.user;
  res.locals.success =req.flash('success')
  res.locals.error =req.flash('error')
  next();
})

//getting the router from the routes folder
const userRoutes = require('./routes/users')
const campgroundsRoutes = require('./routes/campgrounds')
const reviewsRoutes = require('./routes/reviews')

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/Yatena-Camp');
  // await mongoose.connect(dbURl);
  console.log("Mongoose connection open!!");
}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', ejsMate);
app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))//used to override method get or post when submit the edit form






//using the routes with path prefix 
app.use('/', userRoutes)
app.use('/campgrounds', campgroundsRoutes)
app.use('/campgrounds/:id/reviews', reviewsRoutes)

app.get('/', (req,res)=>{
 res.render('home')
})


app.all('*', (req,res,next)=>{
  next(new ExpressError('Page Not Found', 404))
})

//next error message
app.use((err,req,res,next)=>{
  const {statusCode = 500} = err;
  if(!err.message) err.message = 'Sorry, something went wrong!' 
  res.status(statusCode).render('error', {err});
})
//running port
app.listen(3000, ()=>{
    console.log('Listening on port 3000!!!');
})