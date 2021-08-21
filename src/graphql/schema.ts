import { gql } from "apollo-server"

export default gql`
  type Ping {
    name: String
    location: String
    version: String
    uptime: Float
  }
  type LogEvent {
    message: String
    level: String
    service: String
    timestamp: String
  }
  type Query {
    ping: Ping
    logs: [LogEvent]
  }
  schema {
    query: Query
  }
`
