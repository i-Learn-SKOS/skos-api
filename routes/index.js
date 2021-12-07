const config = require('../config');
const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', {
    title: req.app.settings.ourSettings.projectName,
    swaggerRoute: req.app.settings.ourSettings.swaggerRoute,
    base: config.server.base
  });
});

module.exports = router;
