import winston from "winston"
import { Authorization } from "./authorization"

export interface ServiceContext {
  auth: Authorization
  logger: winston.Logger
}
