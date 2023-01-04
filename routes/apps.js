const express = require('express');
const router = express.Router({mergeParams: true});
const {check, validationResult} = require('express-validator');
const {logger} = require("../lib/logger");

const supportedVersion = "v1";

router.all('*',
  check('apiVersion', `Only supported in ${supportedVersion}`)
    .equals(supportedVersion),
  async (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
          return res.status(400).json({errors: errors.array()});
      }
      next();
  });

// For the demo, these are dummy learning applications that are classified with SKOS terms:
const allApps = [
    {
        id: "test_app_1",
        label: "Test app 1",
        classification: [
            "http://ilearn.ilabt.imec.be/vocab/curr1/c-sociaal-relationele-vorming",
            "http://ilearn.ilabt.imec.be/vocab/curr1/s-paarden",
            "http://ilearn.ilabt.imec.be/vocab/curr1/s-voeding"
        ]
    },
    {
        id: "test_app_2",
        label: "Test app 2",
        classification: [
            "http://ilearn.ilabt.imec.be/vocab/vak1/haarverzorging",
            "http://ilearn.ilabt.imec.be/vocab/vak1/merchandising"
        ]
    },
    {
        id: "test_app_3",
        label: "Test app 3",
        classification: [
            "http://ilearn.ilabt.imec.be/vocab/tref1/bodem"
        ]
    },
    {
        id: "test_app_4",
        label: "Test app 4",
        classification: [
            "http://ilearn.ilabt.imec.be/vocab/curr1/c-lichamelijk-geestelijk-en-emotioneel-welzijn"
        ]
    },
    {
        id: "test_app_5",
        label: "Test app 5",
        classification: [
            "http://ilearn.ilabt.imec.be/vocab/curr1/s-mentaal-welbevinden"
        ]
    },
    {
        id: "test_app_6",
        label: "Test app 6",
        classification: [
            "http://ilearn.ilabt.imec.be/vocab/vak1/gedragswetenschappen"
        ]
    },
    {
        id: "test_app_7",
        label: "Test app 7",
        classification: [
            "http://ilearn.ilabt.imec.be/vocab/tref1/mediawijsheid"
        ]
    },
    {
        id: "test_app_8",
        label: "Test app 8",
        classification: [
            "http://ilearn.ilabt.imec.be/vocab/curr2/l-wetenschap-en-techniek"
        ]
    },
    {
        id: "test_app_9",
        label: "Test app 9",
        classification: [
            "http://ilearn.ilabt.imec.be/vocab/curr2/s-techniek"
        ]
    },
    {
        id: "test_app_10",
        label: "Test app 10",
        classification: [
            "http://ilearn.ilabt.imec.be/vocab/curr2/t-techniek-en-samenleving"
        ]
    },
    {
        id: "test_app_11",
        label: "Test app 11",
        classification: [
            "http://ilearn.ilabt.imec.be/vocab/curr2/l-mens-en-maatschappij"
        ]
    }
];

router.all('*', async (req, res, next) => {
    if (req.apiVersion != "v1") {
        return res.status(400).json({error: "Only supported in apiVersion v1"});
    }
    next();
  });

router.get('/', async (req, res, next) => {
    try {
        let body = [];
        if(req.query.filter) {
            const filterConceptUris = new Set(req.query.filter.split(/\s*,\s*/));
            // start with the URIs of concepts as received in the filter parameter
            let finalConceptUris = new Set(filterConceptUris);
            if (req.query.connections) {
                const connectionsParameter = new Set(req.query.connections.split(/\s*,\s*/));
                const connections = new Set();
                for (const connection of ["related", "broader", "broaderTransitive", "narrower", "narrowerTransitive"]) {
                    if (connectionsParameter.has(connection) || connectionsParameter.has("any")) {
                        connections.add(connection);
                    }
                }
                if (connections.size > 0) {
                    // add URIs of connected concepts
                    for (const conceptUri of filterConceptUris) {
                        // this would be an explicit HTTP call to our own route '/skos-api/v2/concepts/:concept':
                        //   const data = (await axios.get(`http://localhost:${config.server.port}/skos-api/v2/concepts/${encodeURIComponent(conceptUri)}`)).data;
                        // but of course we call the business logic method directly instead:
                        const data = await req.app.settings.ourSettings.queryServices["v1"].queryByName('concept', {concept: conceptUri});
                        // add conceptUris of connections to consider only
                        for (const connection of connections) {
                            try {
                                // handles connection data: undefined, single object, array of objects
                                const connectedConcepts = [].concat(data["@graph"][0][connection] || []);
                                for (const concept of connectedConcepts) {
                                    if (concept.id) {
                                        finalConceptUris.add(concept.id);
                                    }
                                }
                            } catch (e) {
                                // catches unexpected data format; warn and continue without crashing
                                logger.warn(`Unexpected data format received for ${conceptUri}`);
                            }
                        }
                    }
                }
            }
            // collect apps that are classified with at least one of the final conceptUris
            for (const conceptUri of finalConceptUris) {
                for (a of allApps) {
                    const classification = [].concat(a.classification || []);
                    if (classification.includes(conceptUri) && !body.includes(a)) {
                        body.push(a);
                    }
                }
            }
        } else {
            // simple case - give them all
            body = allApps;
        }
        res.send(body);
    } catch(e) {
        next(e);
    }
});

module.exports = router;

