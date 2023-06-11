//connect to express
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const ejsMate =require('ejs-mate');
const Campground = require('./models/campground');
const methodOverride = require('method-override');
const path = require('path')

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

app.get('/', (req,res)=>{
 res.render('home')
})

//shows all the campgrounds
app.get('/campgrounds', async (req,res)=>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});
});

//form to create a new campground
app.get('/campgrounds/new', (req, res) => {
  res.render('campgrounds/new');

 });

 //where the forms submit the info
app.post('/campgrounds', async(req,res, next)=>{
  try{
    const campground = new Campground(req.body.campground)
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
  }catch(e){
    next(e)
  }
})

//shows individual campground
app.get('/campgrounds/:id', async(req, res)=>{
  const campground = await Campground.findById(req.params.id)
  res.render('campgrounds/show', {campground})
});

//edit page
app.get('/campgrounds/:id/edit', async(req, res)=>{
  const campground = await Campground.findById(req.params.id);
  res.render('campgrounds/edit', {campground});
})

//where edit submit
app.put('/campgrounds/:id', async(req,res)=>{
  const {id} = req.params
  const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground});
  res.redirect(`/campgrounds/${campground._id}`)
})

//delete campground
app.delete('/campgrounds/:id', async(req, res)=>{
  const {id} = req.params;
  await Campground.findByIdAndDelete(id);
  res.redirect('/campgrounds')
})


app.use((err,req,res,next)=>{
  res.send('Sorry, something went wrong!')
})
//running port
app.listen(3000, ()=>{
    console.log('Listening on port 3000!!!');
})