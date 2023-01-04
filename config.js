// select one serverDomain below
// 1. use next value to connect to the production server from anywhere
//const serverDomain = "https://ilearn.ilabt.imec.be";
// 2. use next value to connect to the development server from anywhere
//const serverDomain = "https://ilearn-dev.ilabt.imec.be";
// 3. use next value to connect to the host that also runs this skos-api in a docker container
//     - requires docker-ce server version >= 20.10
//     - requires docker run command option --add-host=host.docker.internal:host-gateway
//     - see also https://medium.com/@TimvanBaarsen/how-to-connect-to-the-docker-host-from-inside-a-docker-container-112b4c71bc66
const serverDomain = "http://host.docker.internal:3030"

module.exports = {
  // Current version at skosmos/sparql; previous versions at skosmosVx/sparql
  datasourcesPerVersion: {
    "v1": [
      {
        type: "sparql",
        value: `${serverDomain}/skosmosV1/sparql`
      }],
    "v2": [
      {
        type: "sparql",
        value: `${serverDomain}/skosmos/sparql`
      }]
  },
  server: {
    port: 3000,
    base: "/skos-api",
    loglevel: "info"
  }
}
