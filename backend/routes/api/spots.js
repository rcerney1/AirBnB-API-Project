const express = require('express');
const { Op } = require('sequelize')
const { Spot, Review, User, SpotImage, sequelize, ReviewImage, Booking } = require('../../db/models')
const { requireAuth, requireSpotOwner } = require('../../utils/auth');
const { validateReview, validateSpot, validateParameters, bookingConflicts } = require('../../utils/validation');
// const { process_params } = require('express/lib/router');
const router = express.Router();



//Get all Spots
router.get('/', validateParameters, async (req, res)=> {
    //get query parameters
    let {page, size, minLat, minLng, maxLat, maxLng, minPrice, maxPrice } = req.query;
    //set default values for pagination
    page = parseInt(page) || 1;
    size = parseInt(size) || 20;

    if (page < 1) page = 1;
    if (size < 1 || size > 20) size = 20;

     // Create filters object
     const filters = {};

     // Add conditions based on latitude and longitude
     if (minLat) filters.lat = { [Op.gte]: parseFloat(minLat) };
     if (maxLat) filters.lat = { [Op.lte]: parseFloat(maxLat) };
     if (minLng) filters.lng = { [Op.gte]: parseFloat(minLng) };
     if (maxLng) filters.lng = { [Op.lte]: parseFloat(maxLng) };
 
     // Add conditions for price range
     if (minPrice) filters.price = { [Op.gte]: parseFloat(minPrice) };
     if (maxPrice) filters.price = { [Op.lte]: parseFloat(maxPrice) };

    //create query for preview Image to use in sequelize.literal within the attributes array
    const previewImageQuery = `(
        SELECT url FROM SpotImages
        WHERE SpotImages.spotId = spot.id
        LIMIT 1
        )`;
    //create query to find average Rating to use in sequelize.literal
    const avgRatingQuery = `(
        SELECT AVG(stars) FROM Reviews
        WHERE Reviews.spotId = Spot.id
    )`;
    
    //find all spots
    const spots = await Spot.findAll({
        where: filters,
        include: [
            {
                model: Review,
                attributes: []
            },
            {
                model: SpotImage,
                attributes: []
            }
        ],
        attributes: [
            'id',
            'ownerId',
            'address',
            'city',
            'state',
            'country',
            'lat',
            'lng',
            'name',
            'description',
            'price',
            'createdAt',
            'updatedAt',
            [sequelize.literal(avgRatingQuery), 'avgRating'],
            [sequelize.literal(previewImageQuery), 'previewImage']
        ],
        limit: size,
        offset: (page - 1) * size,
    });
    
    //return results w/ pagination
    return res.json({Spots: spots, page, size});
});

router.get('/test', async (req, res) => {
    const spots = await Spot.findAll();
    return res.json(spots)
});

//Get all Spots owned by the Current User
router.get('/current', requireAuth, async (req, res) => {
    //create query for preview Image to use in sequelize.literal within the attributes arrray
    const previewImageQuery = `(
        SELECT url FROM SpotImages
        WHERE SpotImages.spotId = spot.id
        LIMIT 1
        )`;
    const avgRatingQuery = `(
        SELECT AVG(stars) FROM Reviews
        WHERE Reviews.spotId = Spot.id
        )`;
    
    //find all spots
    const spots = await Spot.findAll({
        where: {ownerId: req.user.id}, //current user
        include: [
            {
                model: Review,
                attributes: []
            },
            {
                model: SpotImage,
                attributes: []
            }
        ],
        attributes: [
            'id',
            'ownerId',
            'address',
            'city',
            'state',
            'country',
            'lat',
            'lng',
            'name',
            'description',
            'price',
            'createdAt',
            'updatedAt',
            [sequelize.literal(avgRatingQuery), 'avgRating'],
            [sequelize.literal(previewImageQuery), 'previewImage']
        ],
        
    })
    //! possibly create a formated spots object to return, not right now though because you're tired, lazy, and gay
    return res.json({Spots: spots})
});

// router.get('/current', requireAuth, async (req, res, next) => {
//     try {
//         // create query for preview Image to use in sequelize.literal within the attributes array
//         const previewImageQuery = `(
//             SELECT url FROM SpotImages
//             WHERE SpotImages.spotId = spot.id
//             LIMIT 1
//         )`;
//         const avgRatingQuery = `(
//             SELECT AVG(stars) FROM Reviews
//             WHERE Reviews.spotId = Spot.id
//         )`;
    
//         // find all spots owned by the current user
//         const spots = await Spot.findAll({
//             where: { ownerId: req.user.id },
//             include: [
//                 { model: Review, attributes: [] },
//                 { model: SpotImage, attributes: [] }
//             ],
//             attributes: [
//                 'id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 
//                 'description', 'price', 'createdAt', 'updatedAt',
//                 [sequelize.literal(avgRatingQuery), 'avgRating'],
//                 [sequelize.literal(previewImageQuery), 'previewImage']
//             ]
//         });
    
//         return res.json({ Spots: spots });
//     } catch (error) {
//         next(error);
//     }
// });


//Get details of a Spot from an id
router.get('/:spotId', async (req, res) => {
    const { spotId } = req.params;
    
    const avgRatingQuery = `(
        SELECT AVG(stars) FROM Reviews
        WHERE Reviews.spotId = Spot.id
        )`;
    const numReviews = await Review.count({
        where: {
            spotId: spotId
        }
    })
    

    //get spot by id
    const spot = await Spot.findByPk(spotId, {
        include: [
            {
                model: SpotImage,
                attributes:['id', 'url', 'preview']
            },
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            },
            {
                model: Review,
                attributes: []
            }

        ],
        attributes: [
            'id',
            'ownerId',
            'address',
            'city',
            'state',
            'country',
            'lat',
            'lng',
            'name',
            'description',
            'price',
            'createdAt',
            'updatedAt',
            [sequelize.literal(numReviews), 'NumReviews'],
            [sequelize.literal(avgRatingQuery), 'avgStarRating'],
        ]  
    });

    //check if spot exists or if spot belongs to current user
    if(!spot) {
        return res.status(404).json({
            message: "Spot couldn't be found"
        })
    };

    //return data
    //! create formatted object to return
    return res.json(spot)
})

//create a spot
router.post('/', validateSpot, requireAuth, async (req, res) => {
    const {address, city, state, country, lat, lng, name, description, price } = req.body;
        
    //create new spot
    const newSpot = await Spot.create({
        ownerId: req.user.id,
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price
    });

    //return spot with 201 status code
    return res.status(201).json(newSpot)
});

//Add an Image to a Spot based on the Spot's id
router.post('/:spotId/images', requireAuth, requireSpotOwner, async (req, res) => {
    const { spotId } = req.params;
    const {url, preview} = req.body;

    const spot = await Spot.findByPk(spotId)
  
    //create new image
    const newImage = await SpotImage.create({
        spotId,
        url,
        preview
    });

    //make a little data object to res.json
    const data = {
        id: newImage.id,
        url: newImage.url,
        preview: newImage.preview
    }

    //return data with 201 status code
    return res.status(201).json(data)
});

//edit a spot
router.put('/:spotId', validateSpot, requireAuth, requireSpotOwner, async (req, res) => {
    const { spotId } = req.params;
    const { address, city, state, country, lat, lng, name, description, price } = req.body;

    const spot = await Spot.findByPk(spotId);

    //edit spot
    const updatedSpot = await spot.update({
        address,
        city,
        state,
        country, 
        lat,
        lng,
        name,
        description,
        price
    });
    

    return res.json(updatedSpot);
});

//delete a spot
router.delete('/:spotId', requireAuth, requireSpotOwner, async (req, res) => {
    const { spotId } = req.params;

    const spot = await Spot.findByPk(spotId);


    await spot.destroy();

    return res.json({
        "message": "Successfully deleted"
      });

})

//Create a Review for a Spot based on the Spot's id
router.post('/:spotId/reviews', requireAuth, validateReview, async (req, res) => {
    const { spotId } = req.params;
    const { review, stars } = req.body;
    const userId = req.user.id;

    //check if spot exists
    const spot = await Spot.findByPk(spotId);
    if(!spot) {
        return res.status(404).json({message: "Spot couldn't be found"});
    };

    //check if user already has a review for this spot
    const existingReview = await Review.findOne({where: {userId, spotId}});
    if(existingReview){
        return res.status(500).json({ message: 'User already has a review for this spot'})
    }

    //create a new Review
    const newReview = await Review.create({
        userId,
        spotId,
        review,
        stars
    });

    return res.status(201).json(newReview)
});

//Get all Reviews by a Spot's id
router.get('/:spotId/reviews', async (req, res) => {
    const { spotId } = req.params;
    
    //check if spot exists
    const spot = await Spot.findByPk(spotId);
    if(!spot) {
        return res.status(404).json({ message: "Spot couldn't be found"});
    }

    // Find all reviews for the spot
    const reviews = await Review.findAll({
        where: { spotId },
        include: [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName'],
                as: 'user'
            },
            {
                model: ReviewImage,
                attributes: ['id', 'url']
            }
        ]
    });

    return res.json({Reviews: reviews})
})

//Get all Bookings for a Spot based on the Spot's id
router.get('/:spotId/bookings', requireAuth, async (req, res) => {
    const { spotId } = req.params;
    const userId = req.user.id;

    //check if spot exists
    const spot = await Spot.findByPk(spotId);

    if(!spot) {
        return res.status(404).json({ message: "Spot couldn't be found"});
    }

    //get all bookings for spot
    const bookings = await Booking.findAll({
        where: { spotId },
        include: {
            model: User,
            attributes: ['id', 'firstName', 'lastName'],
            as: 'user'
        },
        attributes: [
            'id',
            'spotId',
            'userId',
            'startDate',
            'endDate',
            'createdAt',
            'updatedAt',
        ]
    });
    
    //if user owns the spot - create a formated data object to return
    if(spot.ownerId === userId) {
        const ownerData = bookings.map(booking => ({
            User: {
                id: booking.user.id,
                firstName: booking.user.firstName,
                lastName: booking.user.lastName
            },
            id: booking.id,
            spotId: booking.spotId,
            userId: booking.userId,
            startDate: booking.startDate,
            endDate: booking.endDdate,
            createdAt: booking.createdAt,
            updatedAt: booking.updatedAt
        }))

        return res.status(200).json({Bookings: ownerData})
    } else {
        const nonOwnerData = bookings.map(booking => ({
            spotId: spotId,
            startDate: booking.startDate,
            endDate: booking.endDate,
        }))
        
        return res.status(200).json({Bookings: nonOwnerData})
    };
})
//Create a Booking from a Spot based on the Spot's id
router.post('/:spotId/bookings', requireAuth, bookingConflicts, async (req, res) => {
    const { spotId } = req.params;
    const { startDate, endDate, createdAt, updatedAt } = req.body;
    const userId = req.user.id;

    //check if spot exists
    const spot = await Spot.findByPk(spotId);
    if(!spot) {
        return res.status(404).json({message: "Spot couldn't be found"})
    }

    //spot can NOT be owned by current user
    if(spot.ownerId === userId) {
        return res.status(403).json({message: "Forbidden"})
    }

    const newBooking = await Booking.create({
        spotId,
        userId,
        startDate,
        endDate,
        createdAt,
        updatedAt
    })

    return res.status(201).json(newBooking)
})

module.exports = router;