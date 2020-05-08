import { Repository, EntityRepository } from 'typeorm';
import { User } from './entities/user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

export enum ErrorCodes {
    UnqiueKeyConflict = '23505'
}

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    public async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        const { username, password } = authCredentialsDto;
        const salt = await bcrypt.genSalt();

        const user = new User();
        user.username = username;
        user.salt = salt;
        user.password = await this.hashPassword(password, salt);

        try {
            await user.save();
        } catch (error) {
            if (error.code === ErrorCodes.UnqiueKeyConflict) {
                throw new ConflictException('Username exists');
            } else {
                throw new InternalServerErrorException();
            }
        }
    }

    public async validateUserPassword(authCredentialsDto: AuthCredentialsDto): Promise<string> {
        const { username, password } = authCredentialsDto;
        const user = await this.findOne({ username });
        
        if (user && await user.validatePassword(password)) {
            return user.username;
        } else {
            return null;
        }
    }

    private async hashPassword(password: string, salt: string): Promise<string> {
        return bcrypt.hash(password, salt);
    }
}