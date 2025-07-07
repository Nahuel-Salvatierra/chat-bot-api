export class CurrentUserDto {
  id?: string;
  externalId: string;
  username: string;
  profile?: any;
}

export class UnregisteredUserDto {
  externalId: string;
  username: string;
}
