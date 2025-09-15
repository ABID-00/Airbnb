const joi = require("joi");

module.exports.listingSchema = joi.object({
    listings: joi.object({
        title: joi.string().required(),
        description: joi.string().required(),
        country: joi.string().required(),
        location: joi.string().required(),
        price: joi.number().required().min(0),
        image: joi.object({
            url: joi.string().uri().allow("").required()
        }).required(),
    }).required(),
});

// module.exports. = listingSchema;