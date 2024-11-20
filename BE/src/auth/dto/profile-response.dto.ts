export class ProfileResponseDto {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }

  name: string;
  email: string;
}
