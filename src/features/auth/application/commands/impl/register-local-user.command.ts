export class RegisterLocalUserCommand {
  constructor(
    public readonly email: string,
    public readonly password: string,
  ) {}
}
