module.exports = {
  datasources: [
    {
      type: "sparql",
      // use next value to connect to the sparql endpoint on the production server from anywhere
      //value: "https://ilearn.ilabt.imec.be/skosmos/sparql"
      // use next value to connect to the sparql endpoint on the development server from anywhere
      //value: "https://ilearn-dev.ilabt.imec.be/skosmos/sparql"
      // use next value to connect to the sparql endpoint on a host that also runs this application in a docker container
      //   - requires docker-ce server version >= 20.10
      //   - requires docker run command option --add-host=host.docker.internal:host-gateway
      //   - see also https://medium.com/@TimvanBaarsen/how-to-connect-to-the-docker-host-from-inside-a-docker-container-112b4c71bc66
      value: "http://host.docker.internal:3030/skosmos/sparql"
    }
  ],
  server: {
    port: 3000,
    base: "/skos-api",
    loglevel: "info"
  }
}
