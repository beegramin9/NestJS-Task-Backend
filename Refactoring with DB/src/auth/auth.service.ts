import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { UserRepository } from './repository/user.repository';

@Injectable()
export class AuthService {
    /* 디펜던시 인젝션으로 UserRepository 사용하기 위해서는
    contstuctor 안에 해야 함 */
    constructor(
        @InjectRepository(UserRepository)
        /* private을 하면 이 클래스 내에서만 쓸 수 있게 만들지만
        그와 동시에 userRepository를 클래스 멤버로 만드는 것과 같음 */
        private userRepository: UserRepository
    ) {}

    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        return this.userRepository.signUp(authCredentialsDto);
    }

    async signIn(authCredentialsDto: AuthCredentialsDto) {
        const username = await this.userRepository.validateUserPassword(authCredentialsDto);
        
        if (!username) /* null */ {
            /* 해커들이 못 알아채도록 ID가 틀렸는지 PW가 틀렸는지 말 안해줌 */
            throw new UnauthorizedException('Invalid credentials.');
        }
    }
}
