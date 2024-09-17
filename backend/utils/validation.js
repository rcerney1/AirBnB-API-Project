const { validationResult, check } = require('express-validator');
const { Op } = require('sequelize')
const {Booking} = require('../db/models');

// middleware for formatting errors from express-validator middleware
// (to customize, see express-validator's documentation)
const handleValidationErrors = (req, _res, next) => {
    const validationErrors = validationResult(req);
  
    if (!validationErrors.isEmpty()) { 
      const errors = {};
      validationErrors
        .array()
        .forEach(error => errors[error.path] = error.msg);
  
      const err = Error("Bad request.");
      err.errors = errors;
      err.status = 400;
      err.title = "Bad request.";
      next(err);
    }
    next();
};

//validateReview MiddleWare
const validateReview = [
  check('review')
      .exists({ checkFalsy: true})
      .withMessage('Review text is required'),
  check('stars')
      .isInt({min: 1, max: 5})
      .withMessage('Stars must be an integer from 1 to 5'),
  handleValidationErrors
];

//validateSpot MiddleWare
const validateSpot = [
  check('address')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Street address is required'),
  check('city')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('city is required'),
  check('state')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('state is required'),
  check('country')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('country is required'),
  check('lat')
    .exists({ checkFalsy: true })
    .notEmpty()
    .isFloat({
      min: -90,
      max: 90
    })
    .withMessage('Latitude must be within -90 and 90'),
  check('lng')
    .exists({ checkFalsy: true })
    .notEmpty()
    .isFloat({
      min: -180,
      max: 180
    })
    .withMessage('Latitude must be within -180 and 180'),
  check('name')
    .exists({ checkFalsy: true })
    .notEmpty()
    .isLength({max: 50})
    .withMessage("Name must be less than 50 characters"),
  check('description')
    .notEmpty()
    .withMessage('Description is required'),
  check('price')
    .exists({ checkFalsy: true })
    .notEmpty()
    .isFloat({min: 0})
    .withMessage("Price per day must be a positive number"),
  handleValidationErrors
]



//bookingConflicts middleWare
const bookingConflicts = async (req, res, next) => {
  const { spotId } = req.params;
  const { startDate, endDate } = req.body;
  const userId = req.user.id;

  // Check for conflicting bookings
  const conflictingBooking = await Booking.findOne({
    where: {
      spotId,
      [Op.or]: [
        {
          startDate: {
            [Op.lte]: endDate
          },
          endDate: {
            [Op.gte]: startDate
          }
        }
      ]
    }
  });
  const newStartDate = new Date(startDate);
  const newEndDate = new Date(endDate)

  if (conflictingBooking) {
    if (newStartDate <= conflictingBooking.endDate && newStartDate >= conflictingBooking.startDate) {
      // Conflict with existing booking's endDate
      return res.status(400).json({
        message: 'Start date conflicts with an existing booking',
        errors: {
          startDate: 'Start date conflicts with an existing booking'
        }
      });
    } else if (newEndDate >= conflictingBooking.startDate && newEndDate <= conflictingBooking.endDate) {
      // Conflict with existing booking's startDate
      return res.status(400).json({
        message: 'End date conflicts with an existing booking',
        errors: {
          endDate: 'End date conflicts with an existing booking'
        }
      });
    }
  }

  

  // If no conflicts, proceed to next middleware or route handler
  next();
};



module.exports = {
    handleValidationErrors,
    validateReview,
    validateSpot,
    bookingConflicts
};

