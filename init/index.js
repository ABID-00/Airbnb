const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const initData = require("./data.js")

let mongo_url="mongodb://127.0.0.1:27017/airbnb";

async function main(){
    await mongoose.connect(mongo_url);
}

main().then(()=>{   
     console.log(`DB connected`);
    })
    .catch((err)=>{
        console.log(`cannot connect to DB ${err}`);
    });


const initDB = async ()=>{
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log(`data was initialized`);
}

initDB();

