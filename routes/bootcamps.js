const express = require('express');
const router = express.Router();

const {
    getBootcamp,
    getBootcamps,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp,
    getBootcampsInRadius,
    bootcampPhotoUpload
} = require('../controllers/bootcamps');

const Bootcamp = require('../models/Bootcamp');
const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

//Include other resource router
const courseRouter = require('./courses');

//Re-route into other resource routers
router.use('/:bootcampId/courses', protect, courseRouter);

router.route('/radius/:zipcode/:distance').get(protect, getBootcampsInRadius);

router
    .route('/')
    .get(advancedResults(Bootcamp, 'courses'), protect, getBootcamps)
    .post(protect, authorize('publisher', 'admin'), createBootcamp);

router
    .route('/:id')
    .get(protect, getBootcamp)
    .put(protect, authorize('publisher', 'admin'), updateBootcamp)
    .delete(protect, authorize('publisher', 'admin'), deleteBootcamp);

router
    .route('/:id/photo')
    .put(protect , authorize('publisher', 'admin'), bootcampPhotoUpload);

module.exports = router;