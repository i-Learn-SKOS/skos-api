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


