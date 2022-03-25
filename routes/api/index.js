const router = require('express').Router();
const thoughtRoutes = require('./thought-routes');
const userRoutes = require('./user-routes');

// add users and thoughts to the beginning of their respective routes
router.use('/thoughts', thoughtRoutes);
router.use('/users', userRoutes);

module.exports = router;