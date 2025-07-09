# i-Learn SKOS API

## Introduction

This project implements a service that exploits the concept schemes defined in the `conceptschemes` project.

As an example, some specific endpoints demonstrate how certain data can be retrieved.

Recommended is the generic GraphQL-LD endpoint, that allows the user to define his/her detailed query.

The project's home page documents the structure of the available data.

The project's home page also links to the page `v2/api-docs`: a swagger page, where all endpoints can be tested interactively.

## Usage

### Install

You need to have Node.js (v14.16.1 or later) installed.

```bash shell
npm install
```

### Run

Development

```bash shell
npm run start:dev
```

Production

```bash shell
npm run start
```

### Access (local)

The homepage is at <http://localhost:3000>.

The swagger page is at <http://localhost:3000/v2/api-docs>.

## Docker

This repo also defines a Docker image in the files `Dockerfile` and `.dockerignore`.

To build it for local usage:

```bash shell
docker build -t i-learn/skos-api .
```

To run it locally (detached, app available at http://localhost:3001):

```bash shell
docker run -d -p 3001:3000 i-learn/skos-api
```

The script `build-and-push-docker-image.sh` is an example script that builds the docker image and pushes it to a docker registry.
It is provided as an example here, because it is written specifically for a given (private) gitlab server supporting docker registry functionality.
Note that for a gitlab server, this script might not be needed, as its actions can be configured in gitlab's CI/CD configuration.

## Testing

An integration test can be done at the swagger page, once this API is deployed on a public server.

For instance, for the API deployed at <https://ilearn.ilabt.imec.be/skos-api/>,
the swagger page for version v2 is at <https://ilearn.ilabt.imec.be/skos-api/v2/api-docs/>.

Beside testing interactively with the "Try it out" button, available for every endpoint,
it is also possible to do so using a `curl` command.
The curl command is displayed along with the formatted result, after executing an interactive test.

Below we give four such `curl` commands, one for each of the first four "Specific endpoints".

```bash
# /collections
curl -X 'GET' 'https://ilearn.ilabt.imec.be/skos-api/v2/collections' -H 'accept: application/json'

# /collections/{collection}, for collection http://ilearn.ilabt.imec.be/vocab/elem/lager-onderwijs
curl -X 'GET' 'https://ilearn.ilabt.imec.be/skos-api/v2/collections/http%3A%2F%2Filearn.ilabt.imec.be%2Fvocab%2Felem%2Flager-onderwijs' -H 'accept: application/json'

# /concepts
curl -X 'GET' 'https://ilearn.ilabt.imec.be/skos-api/v2/concepts' -H 'accept: application/json'

# /concepts/{concept}, for concept https://w3id.org/onderwijs-vlaanderen/id/structuur/lager-1e-leerjaar
curl -X 'GET' 'https://ilearn.ilabt.imec.be/skos-api/v2/concepts/https%3A%2F%2Fw3id.org%2Fonderwijs-vlaanderen%2Fid%2Fstructuur%2Flager-1e-leerjaar' -H 'accept: application/json'
```

The JSON output of above commands is unformatted. We formatted the output using the `jq` command and redirected the results to files as shown below:

```bash
# /collections
curl -X 'GET' 'https://ilearn.ilabt.imec.be/skos-api/v2/collections' -H 'accept: application/json' | jq -M . > collections.json

# /collections/{collection}, for collection http://ilearn.ilabt.imec.be/vocab/elem/lager-onderwijs
curl -X 'GET' 'https://ilearn.ilabt.imec.be/skos-api/v2/collections/http%3A%2F%2Filearn.ilabt.imec.be%2Fvocab%2Felem%2Flager-onderwijs' -H 'accept: application/json'  | jq -M . > collection.json

# /concepts
curl -X 'GET' 'https://ilearn.ilabt.imec.be/skos-api/v2/concepts' -H 'accept: application/json' | jq -M . > concepts.json

# /concepts/{concept}, for concept https://w3id.org/onderwijs-vlaanderen/id/structuur/lager-1e-leerjaar
curl -X 'GET' 'https://ilearn.ilabt.imec.be/skos-api/v2/concepts/https%3A%2F%2Fw3id.org%2Fonderwijs-vlaanderen%2Fid%2Fstructuur%2Flager-1e-leerjaar' -H 'accept: application/json' | jq -M . > concept.json
```

The files are available for reference:

- [collections.json](collections.json)
- [collection.json](collection.json)
- [concepts.json](concepts.json)
- [concept.json](concept.json)