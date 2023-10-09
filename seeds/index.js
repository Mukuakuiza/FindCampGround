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
            author: '64c573a72471073c565a9898',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title:`${sample(descriptors)} ${sample(places)}`,
            description: 'velit tenetur dolor voluptatibus sequi voluptates, rem, obcaecati aspernatur soluta odio sit, velit tenetur dolor voluptatibus sequi voluptates, rem, obcaecati aspernatur soluta odio sit',
            price: price,
            geometry:{
              type:"Point",
              coordinates: [-113.1331, 47.0202]
            },
            images: [
                {
                  url: 'https://res.cloudinary.com/dkdapxuii/image/upload/v1691963656/YatenaCamp/xvgo7idzhzwvbil9o3fo.jpg',
                  filename: 'YatenaCamp/xvgo7idzhzwvbil9o3fo',
                },
                {
                  url: 'https://res.cloudinary.com/dkdapxuii/image/upload/v1691963657/YatenaCamp/yvamrieunopn19pe5xyd.jpg',
                  filename: 'YatenaCamp/yvamrieunopn19pe5xyd',
                }
              ]
        })
        await camp.save();
    }
}
seedDB().then(()=>{
    mongoose.connection.close()
})