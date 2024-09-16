const express = require('express');
const { Spot, Review, User, SpotImage, sequelize, ReviewImage, Booking } = require('../../db/models')
const { requireAuth, requireSpotOwner } = require('../../utils/auth');
const { validateReview, validateSpot } = require('../../utils/validation');
const { process_params } = require('express/lib/router');
const { UPDATE } = require('sequelize/lib/query-types');
const router = express.Router();


// Get all of the Current User's Bookings
router.get('/current', requireAuth, async (req, res) => {
    const previewImageQuery = `(
        SELECT url FROM SpotImages
        WHERE SpotImages.spotId = spot.id
        LIMIT 1
        )`;
    //get all bookings for current user
    const bookings = await Booking.findAll({
        where: {userId: req.user.id},
        include: [
            {
                model: Spot,
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
                    'price',
                    [sequelize.literal(previewImageQuery), 'previewImage']
                ],
                as: 'spot'
                
            }
        ],
        attributes: [
            'id',
            'spotId',
            'userId',
            'endDate',
            'createdAt',
            'updatedAt',
            'startDate',
        ]
    });

    //format the data to fit the api docs
    const formattedData = bookings.map(booking => ({
        id: booking.id,
        spotId: booking.spotId,
        Spot: {
            id: booking.spot.id,
            ownerId: booking.spot.ownerId,
            address: booking.spot.address,
            city: booking.spot.city,
            state: booking.spot.state,
            country: booking.spot.country,
            lat: booking.spot.lat,
            lng: booking.spot.lng,
            name: booking.spot.name,
            price: booking.spot.price,
            previewImage: booking.spot.dataValues.previewImage //! this took me 2 hours to figure out
        },
        userId: booking.userId,
        startDate: booking.startDate,
        endDate: booking.endDate,
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt
    }))

    //console.log(bookings[0].spot.dataValues.previewImage)

    res.json({Bookings: bookings})
})

module.exports = router;