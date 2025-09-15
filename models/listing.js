const mongoose = require("mongoose");

const listingShcema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
    },
    description:String,
    image: {
        url: { type: String, default:  "https://imgs.search.brave.com/dVcXdr2P_K5S9C8VqeuOmOTBG1OlViIKL-PE7a9pviQ/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS1waG90/by93aGl0ZS1ob3Vz/ZS13aXRoLWhvdXNl/LXRvcC1pdF8xMTU5/NTM1LTkzMDAuanBn/P3NlbXQ9YWlzX2Nv/dW50cnlfYm9vc3Qm/dz03NDA" }
    },
    price:{
        type:Number,
    },
    location:String,
    country:String,
})

const Listing = new mongoose.model("Listing",listingShcema);
module.exports= Listing;