//this file is self contained as it connects to mongoose and to models
//connect to express
const mongoose = require('mongoose');
const cities = require('./cities')
const {places, descriptors} = require('./seedHelpers');
const Campground = require('../models/campground');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/Yatena-Camp');
  console.log("Mongoose connection open!!");
}

const sample = array => array[Math.floor(Math.random() * array.length)]

const seedDB = async ()=>{
    await Campground.deleteMany({});
    for(let i =0; i < 50; i++){
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title:`${sample(descriptors)} ${sample(places)}`,
            images: 'https://source.unsplash.com/random/?camping',
            description: 'velit tenetur dolor voluptatibus sequi voluptates, rem, obcaecati aspernatur soluta odio sit, velit tenetur dolor voluptatibus sequi voluptates, rem, obcaecati aspernatur soluta odio sit',
            price: price
        })
        await camp.save();
    }
}
seedDB().then(()=>{
    mongoose.connection.close()
})