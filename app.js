const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js")
const wrapAsync = require("./utils/wrapAsync.js");
const { listingSchema } = require("./schema.js");
const Review = require("./models/reviews.js");



let mongo_url = "mongodb://127.0.0.1:27017/airbnb";

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

async function main() {
    await mongoose.connect(mongo_url);
};

main().then(() => {
    console.log(`DB connected`);
})
    .catch((err) => {
        console.log(`cannot connect to DB ${err}`);
    });

app.listen(4090, () => {
    console.log("app is listening to port 4090..");
});

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, error);
    } else {
        next();
    }
    // next();
}

app.get("/", wrapAsync(
    async (req, res) => {
        let allListings = await Listing.find({});
        res.render("./listings/index.ejs", { allListings });
    }));

app.get("/listings",
    wrapAsync(
        async (req, res) => {
            let allListings = await Listing.find({});
            res.render("./listings/index.ejs", { allListings });
        }));

app.get("/listings/new", (req, res) => {
    res.render("./listings/new.ejs");
});

app.post("/listings", validateListing, wrapAsync(async (req, res) => {
    let listing = req.body.listings;

    // Ensure image is always an object with { url }
    if (typeof listing.image === 'string' || listing.image == null) {
        listing.image = { url: listing.image || "https://default-image-url.com/image.jpg" };
    }

    const newListing = new Listing(listing);
    await newListing.save();
    res.redirect("/listings");
}));

app.get("/listings/:id/edit",
    wrapAsync(
        async (req, res) => {
            let { id } = req.params;
            const listing = await Listing.findById(id);
            console.log(listing);  // Add this line to verify the data

            res.render("./listings/edit.ejs", { listing });
        }));

//edit route
app.put("/listings/:id", validateListing,
    wrapAsync(
        async (req, res) => {
            let { id } = req.params;
            await Listing.findByIdAndUpdate(id, { ...req.body.listings });
            res.redirect(`/listings/${id}`);
        }));

//show route
app.get("/listings/:id",
    wrapAsync(
        async (req, res) => {
            let { id } = req.params;
            let list = await Listing.findById(id);
            res.render("./listings/show.ejs", { list });
        }));

//delete property
app.delete("/listing/:id",
    wrapAsync(
        async (req, res) => {
            let { id } = req.params;
            // console.log(id);
            await Listing.findByIdAndDelete(id);
            res.redirect(`/listings`);
        }
    )
);

//review route
//post route
app.post("/listings/:id/reviews",
    // wrapAsync(
        async (req, res) => {
            let listing = await Listing.findById(req.params.id);
            let newReview = new Review(req.body.review);
            await newReview.save();
            listing.reviews.push(newReview._id);

            await listing.save();

            console.log("new reivew saved");
            res.redirect(`/listings/${listing._id}`);
        }
    // )
);


app.all("*", (req, res, next) => {
        next(new ExpressError(404, 'Page Not Found'));
        // app.render("./listings/error.ejs");
    });


app.use((err, req, res, next) => {
    const { status = 500, message = 'Something went wrong' } = err;
    // res.status(status).send(message);
    res.status(status).render("listings/error", { status, message });
});

