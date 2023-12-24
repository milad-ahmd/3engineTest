const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/activity.controller');

const router = express.Router();

router
  .route('/totalActivePlayersLastWeek')
  .get(controller.totalActivePlayersLastWeek);
router
  .route('/dailyActivePlayerCountLastWeek')
  .get(controller.dailyActivePlayerCountLastWeek);
router
  .route('/averageActivePlayersLastWeek')
  .get(controller.averageActivePlayersLastWeek);
module.exports = router;
