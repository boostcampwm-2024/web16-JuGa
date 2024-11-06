import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/authCredentials.dto';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(@InjectDataSource() dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async registerUser(authCredentialsDto: AuthCredentialsDto) {
    const { email, password } = authCredentialsDto;
    const salt: string = await bcrypt.genSalt();
    const hashedPassword: string = await bcrypt.hash(password, salt);
    const user = this.create({ email, password: hashedPassword });
    await this.save(user);
  }

  async loginUser(authCredentialsDto: AuthCredentialsDto) {
    const { email, password } = authCredentialsDto;
    const user = await this.findOne({ where: { email } });
    if (user && (await bcrypt.compare(password, user.password))) {
      return 'Login successful';
    }

    throw new UnauthorizedException('Login failed');
  }
}
