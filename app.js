const config = require('./config');
const express = require('express');
const path = require('path');
const app = express();
const QueryService = require('./services/queryService');
const YAML = require('yamljs');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = YAML.load('./docs/api-doc-v1.yml');
const swaggerRoute = `${config.server.base}/v1/api-docs`;
const index = require('./routes/index');
const collections = require('./routes/collections');
const concepts = require('./routes/concepts');
const apps = require('./routes/apps');
const overview = require('./routes/overview');
const graphqlld = require('./routes/graphql-ld');

// routes can access each property xxx set below as req.app.settings.ourSettings.xxx
const ourSettings = {
    queryService:  new QueryService(config.datasources),  // - the one and only queryService object
    projectName: 'SKOS API test project',
    swaggerRoute: swaggerRoute
};
app.set('ourSettings', ourSettings);

// view engine setup for pug templating
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// static files (at least used for stylesheets/style.css)
app.use(config.server.base, express.static(path.join(__dirname, 'public')));

// our index page
// when behind a proxy only paths starting with `${config.server.base}` will be accessible, hence the second path here
app.use('/', index);
app.use(`${config.server.base}`, index);

// our swagger page
app.use(swaggerRoute, swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// our core routes
app.use(`${config.server.base}/v1/collections`, collections);
app.use(`${config.server.base}/v1/concepts`, concepts);
app.use(`${config.server.base}/v1/apps`, apps);
app.use(`${config.server.base}/v1/overview`, overview);
app.use(`${config.server.base}/v1/graphqlld`, graphqlld);

app.listen(config.server.port, () => {
    console.log(`Example app listening at port ${config.server.port}`);
});
