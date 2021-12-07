const express = require('express');
const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        const body = await req.app.settings.ourSettings.queryService.queryByName('concepts');
        res.send(body);
    } catch(e) {
        next(e);
    }
});

router.get('/:concept', async (req, res, next) => {
    try {
        const body = await req.app.settings.ourSettings.queryService.queryByName('concept', {concept: req.params.concept});
        res.send(body);
    } catch(e) {
        next(e);
    }
});

module.exports = router;

