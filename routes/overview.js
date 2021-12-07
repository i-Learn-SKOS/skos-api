const express = require('express');
const router = express.Router();

router.get('/sleutelcompetenties', async (req, res, next) => {
    try {
        const body = await req.app.settings.ourSettings.queryService.queryByName('overview-top-down', {collection: "http://ilearn.ilabt.imec.be/vocab/elem/sleutelcompetenties"});
        res.send(body);
    } catch(e) {
        next(e);
    }
});

router.get('/studiedomeinen', async (req, res, next) => {
    try {
        const body = await req.app.settings.ourSettings.queryService.queryByName('overview-top-down', {collection: "http://ilearn.ilabt.imec.be/vocab/elem/studiedomeinen"});
        res.send(body);
    } catch(e) {
        next(e);
    }
});

router.get('/leergebieden', async (req, res, next) => {
    try {
        const body = await req.app.settings.ourSettings.queryService.queryByName('overview-top-down', {collection: "http://ilearn.ilabt.imec.be/vocab/elem/leergebieden"});
        res.send(body);
    } catch(e) {
        next(e);
    }
});

router.get('/onderwijsniveaus', async (req, res, next) => {
    try {
        const body = await req.app.settings.ourSettings.queryService.queryByName('overview-top-down', {collection: "http://ilearn.ilabt.imec.be/vocab/elem/ondniv"});
        res.send(body);
    } catch(e) {
        next(e);
    }
});

router.get('/trefwoorden', async (req, res, next) => {
    try {
        const body = await req.app.settings.ourSettings.queryService.queryByName('overview-related', {collection: "http://ilearn.ilabt.imec.be/vocab/elem/trefwoorden"});
        res.send(body);
    } catch(e) {
        next(e);
    }
});

router.get('/vakken', async (req, res, next) => {
    try {
        const body = await req.app.settings.ourSettings.queryService.queryByName('overview-related', {collection: "http://ilearn.ilabt.imec.be/vocab/elem/vakken"});
        res.send(body);
    } catch(e) {
        next(e);
    }
});

router.get('/onderwijsdoelen', async (req, res, next) => {
    try {
        const body = await req.app.settings.ourSettings.queryService.queryByName('overview-related', {collection: "http://ilearn.ilabt.imec.be/vocab/elem/onddoel"});
        res.send(body);
    } catch(e) {
        next(e);
    }
});

module.exports = router;

