const config = require('../config');
const express = require('express');
const router = express.Router();

const routeMetadata = "/metadata";
const routeSkos = "/skos";
const routeNoSkos = "/no-skos";
const routeGraphical = "/graphical";
const routeApiV1 = "/api-v1";
const routeApiV2 = "/api-v2";
const routeApiHistory = "/api-history";

const sharedInfo = {
  projectName: 'i-Learn SKOS API',
  base: config.server.base,
  pageMetadata: {
    url: `${config.server.base}${routeMetadata}`,
    title: "Metadata considered in this project"
  },
  pageSkos: {
    url: `${config.server.base}${routeSkos}`,
    title: "Metadata expressed with SKOS"
  },
  pageNoSkos: {
    url: `${config.server.base}${routeNoSkos}`,
    title: "Metadata expressed with other vocabularies"
  },
  pageGraphical: {
    url: `${config.server.base}${routeGraphical}`,
    title: "Graphical overview of the metadata"
  },
  pageApiV1: {
    url: `${config.server.base}${routeApiV1}`,
    title: "API v1"
  },
  pageApiV2: {
    url: `${config.server.base}${routeApiV2}`,
    title: "API v2"
  },
  pageApiHistory: {
    url: `${config.server.base}${routeApiHistory}`,
    title: "API history"
  },
};

router.get('/', function(req, res, next) {
  res.render('index', {
    title: sharedInfo.projectName,
    swaggerRoutes: req.app.settings.ourSettings.swaggerRoutes,
    ...sharedInfo
  });
});

router.get(routeMetadata, function(req, res, next) {
  res.render('metadata', {
    title: sharedInfo.pageMetadata.title,
    ...sharedInfo
  });
});

router.get(routeSkos, function(req, res, next) {
  res.render('skos', {
    title: sharedInfo.pageSkos.title,
    ...sharedInfo
  });
});

router.get(routeNoSkos, function(req, res, next) {
  res.render('no-skos', {
    title: sharedInfo.pageNoSkos.title,
    ...sharedInfo
  });
});

router.get(routeGraphical, function(req, res, next) {
  res.render('graphical', {
    title: sharedInfo.pageGraphical.title,
    ...sharedInfo
  });
});

router.get(routeApiV1, function(req, res, next) {
  res.render('api-v1', {
    title: sharedInfo.pageApiV1.title,
    swaggerRoutes: req.app.settings.ourSettings.swaggerRoutes,
    ...sharedInfo
  });
});

router.get(routeApiV2, function(req, res, next) {
  res.render('api-v2', {
    title: sharedInfo.pageApiV2.title,
    swaggerRoutes: req.app.settings.ourSettings.swaggerRoutes,
    ...sharedInfo
  });
});

router.get(routeApiHistory, function(req, res, next) {
  res.render('api-hist', {
    title: sharedInfo.pageApiHistory.title,
    swaggerRoutes: req.app.settings.ourSettings.swaggerRoutes,
    ...sharedInfo
  });
});

module.exports = router;
