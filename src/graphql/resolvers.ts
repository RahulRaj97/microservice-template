import fs from "fs"
import _ from "lodash"

import config from "../util/config"
import { ServiceContext } from "../util/service_context"

const SystemResolvers = {
  Query: {
    ping: (root: any, args: any, context: ServiceContext) => {
      context.logger.info("Pinged")
      return {
        name: process.env.npm_package_name,
        location: config.apollo.hostname,
        version: process.env.npm_package_version,
        uptime: process.uptime()
      }
    },
    logs: (root: any, args: any, context: ServiceContext): any[] => {
      context.auth.mustBeSysAdmin()
      const logConents = fs.readFileSync("logs/service.log")
      const json = `[${logConents.toString().trim().split("/n").join(",")}]`
      return JSON.parse(json)
    }
  }
}

const resolvers = _.merge(SystemResolvers)

export default resolvers
