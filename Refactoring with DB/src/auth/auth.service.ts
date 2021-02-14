import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { UserRepository } from './repository/user.repository';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt/jwt-payload.interface';

@Injectable()
export class AuthService {
    private logger = new Logger('AuthService');

    /* 디펜던시 인젝션으로 UserRepository 사용하기 위해서는
    contstuctor 안에 해야 함 */
    constructor(
        @InjectRepository(UserRepository)
        /* private을 하면 이 클래스 내에서만 쓸 수 있게 만들지만
        그와 동시에 userRepository를 클래스 멤버로 만드는 것과 같음 */
        private userRepository: UserRepository,
        /* 요 jwtService는 auth.module.ts에서 import된 놈을 export해줬으니
        데코레이터가 필요 없는 듯 하네. auth.module.ts에서는 
        디펜던시 인젝션을 자동으로 해주는구나 */
        private jwtService: JwtService
    ) {}

    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        return this.userRepository.signUp(authCredentialsDto);
    }

    async signIn(authCredentialsDto: AuthCredentialsDto): Promise<{accessToken: string}> {
        const username = await this.userRepository.validateUserPassword(authCredentialsDto);
        if (!username) /* null */ {
            /* 해커들이 못 알아채도록 ID가 틀렸는지 PW가 틀렸는지 말 안해줌 */
            throw new UnauthorizedException('Invalid credentials.');
        }
        /* 일단은 username만 넣기, jwtPayload의 타입을 마치 DTO처럼 정해놓음 */
        const payload: JwtPayload = { username };
        
        /* 여기서 에러발생. jwtService에 에러가 있는거같은데... */
        const accessToken = await this.jwtService.sign(payload);

        this.logger.debug(`Generated JWT Token with payload ${JSON.stringify(payload)}`);

        return { accessToken }
    }
}
