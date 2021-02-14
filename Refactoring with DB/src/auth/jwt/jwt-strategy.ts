import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UserRepository } from '../repository/user.repository';
import { User } from '../entity/user.entity';
import { JwtPayload } from './jwt-payload.interface';
import * as config from 'config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository
    ) {
        /* extends from 하는 PassportStrategy(Strategy)에서 
        contrusctor를 상속받을 것 */
        super({
            /* Request로부터 Jwt토큰을 가져올 것
            어떻게? Request의 Header로부터
            Postman에서 보면
            Authorization : Bearer+띄어쓰기+accessToken으로 들어옴
            
            get방시에서는 Authorization => Bearer Token => 로그인했을 때
            새로 생성된 토큰으로*/
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            /* 토큰의 signiture를 verify하기 위해 사용  */
            secretOrKey: process.env.JWT_SECRET || config.get('jwt.secret')
        });
    };
    /* validate 메소드는 모든 strategy가 가지고 있어야 하는 method 
    여기서 payload는 이미 'topSecret51'에 의해 verification이 끝남
    그렇기 때문에 payload의 타입을 JwtPayload라고 할 수 있는 것 */
    async validate(payload: JwtPayload): Promise<User> {
        /* 이 메소드의 리턴값은 Authentication으로 방어가 되는 
        모든 동작에 적용될 것 */
        const { username } = payload;
        const user = await this.userRepository.findOne( {username} );
    
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}