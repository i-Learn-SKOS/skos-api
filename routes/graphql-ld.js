const express = require('express');
const router = express.Router({mergeParams: true});
const { query, validationResult } = require('express-validator');

router.get('/',
  query('query', 'should be a GraphQL-LD query')
    .matches(/^[^]*{\s*[^]+\s*}\s*$/, "m"), // a simple GraphQL-LD syntax validator; anything followed by anything between curly braces :-)
  query('parameters', 'if present, should be valid JSON')
    .optional()
    .isJSON(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const body = await req.app.settings.ourSettings.queryServices[req.params.apiVersion].queryGraphQlLd(req.query.query, req.query.parameters);
      res.send(body);
    } catch(e) {
      let code;
      let msg;
      if (e.message.search(/Syntax Error/i) >= 0) {
        code = 400;
        msg = "Invalid query";
      } else if (e.message.search(/undefined/i) > 0) {
        code = 400;
        msg = "Invalid query";
      } else {
        code = 500;
        msg = "Unexpected error";
      }
      return res.status(code).json({ error: msg, detail: e.message})
    }
  }
);

module.exports = router;
