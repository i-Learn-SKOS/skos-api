module.exports = {
  datasources: [
    {type: "sparql", value: "https://ilearn.ilabt.imec.be/skosmos/sparql"}
  ],
  server: {
    port: 3000,
    base: "/skos-api"
  }
}
