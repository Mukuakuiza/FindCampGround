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
app.use(express.static(path.join(__dirname,'public')));

const sessionConfig={
  secret: 'thisshouldbebettersecret!',
  resave: false,
  saveUninitialized: true,
  cookie:{
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}
app.use(session(sessionConfig))
app.use(flash());

//flash middleware
app.use((req, res, next)=>{
  res.locals.success =req.flash('success')
  res.locals.error =req.flash('error')
  next();
})

//getting the router from the routes folder
const campgrounds = require('./routes/campgrounds')
const reviews = require('./routes/reviews')

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/Yatena-Camp');
  console.log("Mongoose connection open!!");
}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', ejsMate);
app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))//used to override method get or post when submit the edit form






//using the routes with path prefix 
app.use('/campgrounds', campgrounds)
app.use('/campgrounds/:id/reviews', reviews)

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