const fs = require('fs').promises;
const path = require('path');
const axios = require('axios').default;
const process = require('process');
const querystring = require('querystring');
const {logger} = require("../lib/logger");

// GraphQL-LD with Comunica
// see:
//   https://github.com/rubensworks/graphql-ld-comunica.js
const Client = require("graphql-ld").Client;
const QueryEngineComunica = require("graphql-ld-comunica").QueryEngineComunica;
const LoggerPretty = require("@comunica/logger-pretty").LoggerPretty;

const extensions = [
    ".cgq",  // Comunica, GraphQL-LD query (allows federates queries)
    ".rq"    // SPARQL query sent to SPARQL endpoint directly (only for single endpoint queries!)
];

class QueryService {
    constructor(version, datasources) {
        this.version = version;
        this.datasources = datasources;
        this.queryTemplates = {};
        this.queryExtensions = {};
        this.comunicaContexts = {};
        this.comunicaQueryEngine = null;
    }

    /**
     * Execute a fixed query, selected by means of a query filename
     * @param name Query filename; file is located in this project's "queries/<version>" folder or, if not found there, in this project's "queries" folder
     * @param parameters Object containing parameters and their values; each parameter found in the query  will be substituted by its value
     * @returns Promise
     */
    async queryByName(name, parameters = {}) {
        // cache the template file reading result
        if (!this.queryTemplates[name]) {
            for (const filename of [path.resolve(__dirname, `../queries/${this.version}/${name}`), path.resolve(__dirname, `../queries/${name}`)]) {
                let found = false;
                for (const ext of extensions) {
                    try {
                        this.queryTemplates[name] = await fs.readFile(filename + ext, 'utf8');
                    } catch (e) {
                        // file does not exist, try next extension
                        continue;
                    }
                    this.queryExtensions[name] = ext;
                    found = true;
                    break;
                }
                if (found) {
                    break;
                }
            }
            if (!this.queryTemplates[name]) {
                throw new RangeError("no template available for " + name);
            }
        }
        const query = QueryService._fillInParameters(this.queryTemplates[name], parameters);
        let response;
        switch (this.queryExtensions[name]) {
            case ".cgq":
                response = await this.queryWithComunica(query);
                break;
            case ".rq":
                response = await this.querySparqlEndpointDirectly(query);
                break;
        }
        return response;
    }

    /**
     * Executes any GraphQL-LD query, assuming a default context
     * @param query a GraphQL-LD query string
     * @param parameters an optional JSON string, containing key-value properties for parameter substitution in the query
     * @returns {Promise<void>}
     */
    async queryGraphQlLd(query, parameters) {
        // prepare the 3 inputs for this._queryWithComunicaLowLevel()
        const relativeFilename = "contexts/common-context.json";
        const graphQlLdQuery = query.trim();
        let additionalContextString;
        try {
            additionalContextString = parameters.trim();
        } catch (e) {
            additionalContextString = "";
        }
        // and call it...
        return await this._queryWithComunicaLowLevel(relativeFilename, additionalContextString, graphQlLdQuery)
    }

    static _fillInParameters(query, parameters) {
        for (const param in parameters) {
            // replace %parameter% with the actual parameter value
            query = query.split(`%${param}%`).join(`${parameters[param]}`);
        }
        return query;
    }

    async _queryWithComunicaLowLevel(relativeFilename, additionalContextString, graphQlLdQuery) {
        // cache the contexts
        if (!this.comunicaContexts[relativeFilename]) {
            const filename = path.resolve(__dirname, `../queries/${this.version}/${relativeFilename}`);
            try {
                const txt = await fs.readFile(filename, "utf8");
                this.comunicaContexts[relativeFilename] = JSON.parse(txt);
            } catch (e) {
                throw new Error(`Not a valid context file: ${filename}`);
            }
        }

        // make the context to send to the Comunica engine
        let additionalContext = {};
        if (additionalContextString.length > 0) {
            try {
                additionalContext = JSON.parse(additionalContextString);
            } catch (e) {
                throw new Error("Syntax error in additional context");
            }
        }
        const combinedContext = {"@context": {...this.comunicaContexts[relativeFilename], ...additionalContext}};

        // construct and save one Comunica query engine
        if (!this.comunicaQueryEngine) {
            this.comunicaQueryEngine = new QueryEngineComunica({
                sources: this.datasources,
                log: new LoggerPretty({ level: "error" }) // set to info to see request details
            });
        }

        // query Comunica
        const client = new Client({context: combinedContext, queryEngine: this.comunicaQueryEngine});
        logger.info(`GraphQL LD query and additional context:\n${graphQlLdQuery}\n${additionalContextString}`);
        const t1 = process.hrtime.bigint();
        let data = (await client.query({query: graphQlLdQuery})).data;
        const t2 = process.hrtime.bigint();
        logger.info(`GraphQL LD query executed in ${(t2-t1)/1000000n} milliseconds.`);

        // object containing the JSON-LD answer
        return {"@context": this.comunicaContexts[relativeFilename], "@graph": data};
    }

    // supports federated queries - query consists of three parts, delimited by "===" lines in a single text block
    async queryWithComunica(query) {
        const queryPieces = query.split("===");
        if (queryPieces.length !== 3) {
            throw new Error("Query template for Comunica should consist of 3 parts, separated by '==='");
        }
        // part 1: filename (path relative to queries), of the JSON-LD context
        const relativeFilename = queryPieces[0].trim();
        // part 2: optional additional piece of context; why does it exist?
        //         - originally, because defining or looking up the id of entities
        //           (https://github.com/rubensworks/graphql-to-sparql.js#defining-or-looking-up-the-id-of-entities)
        //           doesn't work in Comunica, unless you add that id to the context
        //         - while it's here, we also use it to add optional context entries to be forwarded to Comunica,
        //           but not to be retained in the returned result
        const additionalContextString = queryPieces[1].trim();
        // part 3: the GraphQL-LD query to give to Comunica
        const graphQlLdQuery = queryPieces[2].trim();

        return await this._queryWithComunicaLowLevel(relativeFilename, additionalContextString, graphQlLdQuery)
    }

    // does not support federated queries (only uses first datasource) - query is a SPARQL query
    async querySparqlEndpointDirectly(query) {
        const data = await axios.post(this.datasources[0].value, querystring.stringify({ query }));
        // object containing the JSON answer
        return data.data;
    }
}

module.exports = QueryService;
