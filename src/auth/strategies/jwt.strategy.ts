import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { JwtPayload } from '../models/jwt-payload.interface';
import { UserRepository } from '../user.repository';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(@InjectRepository(UserRepository) private userRepository: UserRepository) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: 'topSecret51'
        });
    }

    async validate(payload: JwtPayload) {
        const { username } = payload;
        const user = await this.userRepository.findOne({ username });
    }
}