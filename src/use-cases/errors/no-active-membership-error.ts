export class NoActiveMembershipError extends Error {
  constructor() {
    super('No active membership found.')
  }
}
