//connect to express
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const path = require('path')

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/Yatena-Camp');
  console.log("Mongoose connection open!!");
}


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.get('/', (req,res)=>{
 res.render('home')
})

//shows all the campgrounds
app.get('/campgrounds', async (req,res)=>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});
})

//shows individual campground
app.get('/campgrounds/:id', async(req, res)=>{
  const campground = await Campground.findById(req.params.id)
  res.render('campgrounds/show', {campground})
})

//running port
app.listen(3000, ()=>{
    console.log('Listening on port 3000!!!');
})