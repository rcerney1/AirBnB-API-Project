const express = require('express');
const router = require('express').Router();
const { Sequelize } = require('sequelize');
const { SpotImage, Spot, User, Review, ReviewImage, sequelize } = require('../../db/models');
const { requireAuth, requireReviewOwner } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors, validateReview } = require('../../utils/validation');

//get all reviews for current user
router.get('/current', requireAuth, async (req, res) => {
    const previewImageQuery = `(
        SELECT url FROM SpotImages
        WHERE SpotImages.spotId = spot.id
        LIMIT 1
        )`;

    const reviews = await Review.findAll({
        where: { userId: req.user.id },
        attributes: ['id', 'userId', 'spotId', 'review', 'stars', 'createdAt', 'updatedAt'],
        include: [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
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
router.post('/:reviewId/images', requireAuth, requireReviewOwner, async (req, res) => {
    const { reviewId } = req.params;
    const { url } = req.body;

    //check if review image limit has been reached
    const reviewImageCount = await ReviewImage.findAll({
        where: { reviewId }
    });

    if (reviewImageCount.length >= 10) {
        return res.status(403).json({message: "Maximum number of images for this resource was reached"})
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
router.put('/:reviewId', requireAuth, validateReview, requireReviewOwner, async (req, res) => {
    const { reviewId } = req.params;
    const { review, stars } = req.body;
    const existingReview= await Review.findByPk(reviewId);

    //edit review
    const updatedReview = await existingReview.update({
        review, 
        stars
    });

    //format object to return
    const formattedReview = {
        id: updatedReview.id,
        userId: updatedReview.userId,
        spotId: updatedReview.spotId,
        review: updatedReview.review,
        stars: updatedReview.stars,
        createdAt: updatedReview.createdAt,
        updatedAt: updatedReview.updatedAt
    }

    return res.json(formattedReview)
});

//Delete a Review
router.delete('/:reviewId', requireAuth, async (req, res) => {
    const { reviewId } = req.params;

    //check to see if review exists
    const review = await Review.findByPk(reviewId);
    if(!review) {
        return res.status(404).json({message: "Review couldn't be found"});
    };

    //check if review belongs to current user
    if(review.userId !== req.user.id) {
        return res.status(403).json({message: "Review must belong to current user"})
    }

    await review.destroy();
    return res.json({
        message: "Successfully deleted"
    })
})




module.exports = router;