import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    /* Service 메소드를 사용하고 싶은데 
    디펜던시 인젝션은 무조건 constructor 안에서 가능 */
    constructor(
        private authService: AuthService
    ) {}

    @Post('/signup')
    async signUp(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto): Promise<void> {
        return this.authService.signUp(authCredentialsDto);
    }
    
    @Post('/signin')
    async singIn(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto) {
        return this.authService.signIn(authCredentialsDto);
    }
}
