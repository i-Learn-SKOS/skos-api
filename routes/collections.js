const express = require('express');
const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        const body = await req.app.settings.ourSettings.queryService.queryByName('collections');
        res.send(body);
    } catch(e) {
        next(e);
    }
});

router.get('/:collection', async (req, res, next) => {
    try {
        const body = await req.app.settings.ourSettings.queryService.queryByName('collection', {collection: req.params.collection});
        res.send(body);
    } catch(e) {
        next(e);
    }
});

module.exports = router;
