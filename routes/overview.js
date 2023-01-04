const express = require('express');
const router = express.Router({mergeParams: true});

const uris = {
    v1: {
        sleutelcompetenties: "http://ilearn.ilabt.imec.be/vocab/elem/sleutelcompetenties",
        leergebieden: "http://ilearn.ilabt.imec.be/vocab/elem/leergebieden",
        onderwijsstructuur: "http://ilearn.ilabt.imec.be/vocab/elem/ondniv",
        trefwoorden: "http://ilearn.ilabt.imec.be/vocab/elem/trefwoorden",
        vakken: "http://ilearn.ilabt.imec.be/vocab/elem/vakken",
        onderwijsdoelen: "http://ilearn.ilabt.imec.be/vocab/elem/onddoel"
    },
    v2: {
        sleutelcompetenties: "http://ilearn.ilabt.imec.be/vocab/elem/sleutelcompetenties",
        leergebieden: "http://ilearn.ilabt.imec.be/vocab/elem/leergebieden",
        onderwijsstructuur: "https://w3id.org/onderwijs-vlaanderen/id/collectie/structuur",
        trefwoorden: "http://ilearn.ilabt.imec.be/vocab/elem/trefwoorden",
        vakken: "https://w3id.org/onderwijs-vlaanderen/id/collectie/vak",
        onderwijsdoelen: "http://ilearn.ilabt.imec.be/vocab/elem/onddoel"
    }
};

router.get('/sleutelcompetenties', async (req, res, next) => {
    try {
        const body = await req.app.settings.ourSettings.queryServices[req.params.apiVersion].queryByName('overview-top-down', {collection: uris[req.params.apiVersion].sleutelcompetenties});
        res.send(body);
    } catch(e) {
        next(e);
    }
});

router.get('/leergebieden', async (req, res, next) => {
    try {
        const body = await req.app.settings.ourSettings.queryServices[req.params.apiVersion].queryByName('overview-top-down', {collection: uris[req.params.apiVersion].leergebieden});
        res.send(body);
    } catch(e) {
        next(e);
    }
});

router.get('/onderwijsstructuur', async (req, res, next) => {
    try {
        const body = await req.app.settings.ourSettings.queryServices[req.params.apiVersion].queryByName('overview-top-down', {collection: uris[req.params.apiVersion].onderwijsstructuur});
        res.send(body);
    } catch(e) {
        next(e);
    }
});

router.get('/trefwoorden', async (req, res, next) => {
    try {
        const body = await req.app.settings.ourSettings.queryServices[req.params.apiVersion].queryByName('overview-related', {collection: uris[req.params.apiVersion].trefwoorden});
        res.send(body);
    } catch(e) {
        next(e);
    }
});

router.get('/vakken', async (req, res, next) => {
    try {
        const body = await req.app.settings.ourSettings.queryServices[req.params.apiVersion].queryByName('overview-related', {collection: uris[req.params.apiVersion].vakken});
        res.send(body);
    } catch(e) {
        next(e);
    }
});

router.get('/onderwijsdoelen', async (req, res, next) => {
    try {
        const body = await req.app.settings.ourSettings.queryServices[req.params.apiVersion].queryByName('overview-related', {collection: uris[req.params.apiVersion].onderwijsdoelen});
        res.send(body);
    } catch(e) {
        next(e);
    }
});

module.exports = router;

