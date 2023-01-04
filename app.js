const config = require('./config');
const express = require('express');
const path = require('path');
const app = express();
const {logger} = require("./lib/logger");
const QueryService = require('./services/queryService');
const YAML = require('yamljs');
const swaggerUi = require('swagger-ui-express');
const swaggerDocumentV1 = YAML.load('./docs/api-doc-v1.yml');
const swaggerRouteV1 = `${config.server.base}/v1/api-docs`;
const swaggerDocumentV2 = YAML.load('./docs/api-doc-v2.yml');
const swaggerRouteV2 = `${config.server.base}/v2/api-docs`;
const index = require('./routes/index');
const collections = require('./routes/collections');
const concepts = require('./routes/concepts');
const apps = require('./routes/apps');
const overview = require('./routes/overview');
const graphqlld = require('./routes/graphql-ld');
const {check, validationResult} = require("express-validator");

logger.level = config.server.loglevel;

// routes can access each property xxx set below as req.app.settings.ourSettings.xxx
const ourSettings = {
    queryServices: {
      // one service per API version
      "v1": new QueryService("v1", config.datasourcesPerVersion.v1),
      "v2": new QueryService("v2", config.datasourcesPerVersion.v2),
    },
    swaggerRoutes: {
      // one route per API version
      "v1": swaggerRouteV1,
      "v2": swaggerRouteV2
    }
};
app.set('ourSettings', ourSettings);

// view engine setup for pug templating
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// static files (at least used for stylesheets/style.css)
app.use(config.server.base, express.static(path.join(__dirname, 'public')));

// our index page
app.use(`${config.server.base}`, index);
// alt. index home page (not working when behind a proxy, but useful for local debugging)
app.use('/', index);

// our swagger pages
app.use(swaggerRouteV1, swaggerUi.serveFiles(swaggerDocumentV1), swaggerUi.setup(swaggerDocumentV1));
app.use(swaggerRouteV2, swaggerUi.serveFiles(swaggerDocumentV2), swaggerUi.setup(swaggerDocumentV2));

// our core routes
app.all(`${config.server.base}/:apiVersion/*`,
  check('apiVersion', 'not supported API version')
    .if(check('apiVersion').matches('v[0-9\\.]+'))
    .isIn(['v1', 'v2']),
  async (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
          return res.status(400).json({errors: errors.array()});
      }
      next();
  });
app.use(`${config.server.base}/:apiVersion/collections`, collections);
app.use(`${config.server.base}/:apiVersion/concepts`, concepts);
app.use(`${config.server.base}/:apiVersion/apps`, apps);
app.use(`${config.server.base}/:apiVersion/overview`, overview);
app.use(`${config.server.base}/:apiVersion/graphqlld`, graphqlld);

app.listen(config.server.port, () => {
    logger.info(`Example app listening at port ${config.server.port}`);
});
