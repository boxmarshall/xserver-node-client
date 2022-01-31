export class ValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ValidationError'

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, ValidationError.prototype)
  }
}

export class ServiceError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ServiceError'

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, ServiceError.prototype)
  }
}

export class ManagerError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ManagerError'

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, ManagerError.prototype)
  }
}

export class AgentConnectionFailure extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AgentConnectionFailure'

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, AgentConnectionFailure.prototype)
  }
}
