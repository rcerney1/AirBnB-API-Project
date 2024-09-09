const router = require('express').Router();
const { setTokenCookie } = require('../../utils/auth.js');
const { User } = require('../../db/models');
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
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

module.exports = router;