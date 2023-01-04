const express = require('express');
const router = express.Router({mergeParams: true});

router.get('/', async (req, res, next) => {
    try {
        const body = await req.app.settings.ourSettings.queryServices[req.params.apiVersion].queryByName('concepts');
        res.send(body);
    } catch(e) {
        next(e);
    }
});

router.get('/:concept', async (req, res, next) => {
    try {
        const body = await req.app.settings.ourSettings.queryServices[req.params.apiVersion].queryByName('concept', {concept: req.params.concept});
        res.send(body);
    } catch(e) {
        next(e);
    }
});

module.exports = router;

