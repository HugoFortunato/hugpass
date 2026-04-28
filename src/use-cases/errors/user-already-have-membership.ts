export class UserAlreadyHaveMembershipError extends Error {
  constructor() {
    super('User already have a membership.')
  }
}
