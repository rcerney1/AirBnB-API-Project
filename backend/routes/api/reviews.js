const express = require('express');
const router = require('express').Router();
const { Sequelize } = require('sequelize');
const { SpotImage, Spot, User, Review, ReviewImage, sequelize } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

//middleware to validate reviews //! DONT FORGET TO DO THIS BABY GIRLLLLLLLLLL ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`
const validateReviews = [];

//get all reviews for current user
router.get('/current', requireAuth, async (req, res) => {
    const previewImageQuery = `(
        SELECT url FROM SpotImages
        WHERE SpotImages.spotId = spot.id
        LIMIT 1
        )`;

    const reviews = await Review.findAll({
        where: { userId: req.user.id },
        attributes: ['id', 'userId', 'spotId', 'review', 'stars'],
        include: [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName'],
                as: 'user'
            },
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
            },
            {
                model: ReviewImage,
                attributes: ['id', 'url']
            }
        ]
    });

    return res.json({Reviews: reviews})
});

//Add an Image to a Review based on the Review's id
router.post('/:reviewId/images', requireAuth, async (req, res) => {
    const { reviewId } = req.params;
    const { url } = req.body;

    //check if review exists
    const review = await Review.findByPk(reviewId);
    if(!review) {
        return res.status(404).json({message: "Review couldn't be found"})
    }

    //check if review image limit has been reached
    const reviewImageCount = await ReviewImage.findAll({
        where: { reviewId }
    });

    if (reviewImageCount.length >= 10) {
        return res.status(403).json("Maximum number of images for this resource was reached")
    };

    // Create new review image
    const newImage = await ReviewImage.create({
        reviewId,
        url
    });

    return res.status(201).json({
        id: newImage.id, 
        url: newImage.url
    });
});

//Edit a Review
// router.put();




module.exports = router;