const express = require('express');
const activityRoutes = require('./activity.route');

const router = express.Router();

/**
 * GET v1/status
 */
router.get('/status', (req, res) => res.send('OK'));

/**
 * GET v1/docs
 */
router.use('/docs', express.static('docs'));

router.use('/activities', activityRoutes);

module.exports = router;
