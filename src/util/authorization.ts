import _ from "lodash"
import { ForbiddenError, AuthenticationError } from "apollo-server"

// System Admin Token
const SYSADMIN_TOKEN = ""

// Supported Services
export enum Service {}

export interface AuthContext {
  auth: Authorization
}

export class Authorization {
  constructor(public token: string = "") {}

  isSysAdmin(): boolean {
    return this.token === SYSADMIN_TOKEN
  }

  /** Fail with error if the token is not system adminstrator.*/
  mustBeSysAdmin() {
    if (!this.isSysAdmin()) throw new ForbiddenError("User not authorized.")
  }

  mustBeService(service: Service) {}
}
