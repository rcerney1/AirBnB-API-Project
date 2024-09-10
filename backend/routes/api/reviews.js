const express = require('express');
const { Spot, Review, User, SpotImage, sequelize } = require('../../db/models')
const { requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { process_params } = require('express/lib/router');
const router = express.Router();