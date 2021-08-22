import * as fs from "fs"
import chalk from "chalk"
import * as http from "http"
import express from "express"
import winston from "winston"
import * as https from "https"
import { ApolloServer } from "apollo-server-express"

import {
  ApolloServerPluginLandingPageDisabled,
  ApolloServerPluginLandingPageGraphQLPlayground
} from "apollo-server-core"

import configurations from "./util/config"
import { Authorization } from "./util/authorization"

/** Load the environment specific configuration */
const configPath = configurations.path
const config = configurations.apollo

import typeDefs from "./graphql/schema"
import resolvers from "./graphql/resolvers"

const app = express()

function createWinstonFormatter() {
  return winston.format.combine(
    winston.format.json(),
    winston.format.colorize(),
    winston.format.timestamp()
  )
}

function createWinstonTransports() {
  return [
    new winston.transports.File({
      filename: "logs/service.log"
    }),
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error"
    }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
}

const logger = winston.createLogger({
  level: "info",
  format: createWinstonFormatter(),
  defaultMeta: { service: process.env.npm_package_name },
  transports: createWinstonTransports()
})

async function getContext({ req }: { req: any }) {
  const token = ((req && req.headers.authorization) || "").replace(
    "Bearer ",
    ""
  )
  const auth = new Authorization(token)
  return { auth, logger }
}

function createServer() {
  return config.ssl
    ? https.createServer(
        {
          key: fs.readFileSync(`${configPath}/ssl/server.key`),
          cert: fs.readFileSync(`${configPath}/ssl/server.crt`),
          ca: fs.readFileSync(`${configPath}/ssl/bundle.crt`)
        },
        app
      )
    : http.createServer(app)
}

async function startApolloServer() {
  const apollo = new ApolloServer({
    typeDefs,
    resolvers,
    debug: config.debug,
    introspection: config.introspection,
    plugins: [
      config.playground
        ? ApolloServerPluginLandingPageGraphQLPlayground()
        : ApolloServerPluginLandingPageDisabled()
    ],
    context: getContext
  })
  await apollo.start()
  apollo.applyMiddleware({
    app,
    path: "/",
    bodyParserConfig: { limit: "50mb" },
    cors: { origin: "*" }
  })
  await new Promise(() =>
    createServer().listen({ port: config.port }, () => {})
  )
}

startApolloServer()
