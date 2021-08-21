import winston from "winston"
import { Authorization } from "./authorization"
import { ServiceContext } from "./service_context"

export namespace Mocks {
  export enum Role {
    SysAdmin,
    Service
  }

  export function auth(role: Role): Authorization {
    const mockAuth: any = {}
    switch (role) {
      case Role.SysAdmin:
        mockAuth.isSysAdmin = jest.fn(() => true)
        break
      case Role.Service:
        mockAuth.mustBeService = jest.fn(() => true)
        break
    }
    return mockAuth
  }

  export function logger(): winston.Logger {
    const mockLogger: any = {}
    mockLogger.info = jest.fn(() => undefined)
    mockLogger.log = jest.fn(() => undefined)
    mockLogger.debug = jest.fn(() => undefined)
    mockLogger.warn = jest.fn(() => undefined)
    return mockLogger
  }

  export function serviceContext(): ServiceContext {
    return {
      auth: auth(Role.Service),
      logger: logger()
    }
  }

  export function sysAdminContext(): ServiceContext {
    return { auth: auth(Role.SysAdmin), logger: logger() }
  }

  export function context(): ServiceContext {
    return {
      auth: {} as Authorization,
      logger: logger()
    }
  }
}
