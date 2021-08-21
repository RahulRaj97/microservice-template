const environment = process.env.NODE_ENV || "test"
const configurations = require("../../environments/config.json")

if (!configurations[environment])
  throw `Configuration not found for environment ${environment}`

export default {
  ...configurations[environment],
  name: environment,
  path: `./environments/${environment}`
}
