const { setTokenCookie } = require('../../utils/auth.js');
const { User } = require('../../db/models');

const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const spotsRouter = require('./spots.js');
const bookingsRouter = require('./bookings.js');
const reviewsRouter = require('./reviews.js');
const spotImageRouter = require('./spotImages.js')
const reviewImageRouter = require('./reviewImages.js')


const { restoreUser } = require('../../utils/auth.js');


//test 
router.post('/test', function(req, res) {
    res.json({ requestBody: req.body });
});

// Connect restoreUser middleware to the API router
  // If current user session is valid, set req.user to the user in the database
  // If current user session is not valid, set req.user to null
router.use(restoreUser);

//connect users and session routers
router.use('/session', sessionRouter);

router.use('/users', usersRouter);

router.use('/spots', spotsRouter);

router.use('/reviews', reviewsRouter);

router.use('/bookings', bookingsRouter);

router.use('/spot-images', spotImageRouter);

router.use('/review-images', reviewImageRouter);

module.exports = router;