import { Body, Controller, Post, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorator/get-user.decorator';
import { User } from './entity/user.entity';

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
    async singIn(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto): Promise<{accessToken: string}> {
        return this.authService.signIn(authCredentialsDto);
    }

    // 밑은 정말 Test, 사실 필요하지 않다.
    @Post('/test')
    /* Authentication 메커니즘을 적용하기 위해선
    콘트롤러에 메커니즘을 적용하거나
    콘트롤러의 request마다 적용할 수 있음 */
    @UseGuards(AuthGuard())
    /* Body나 Header만 가져오는 게 아니라 Req 전체를 가져오고 싶음 */
    test(@GetUser() user: User) {
        /* 이전에는 @Req() req로 request 전체를 가져왔음
        이제는 @GetUser라는 custom decorator를 만들어서 더 간단하게 */
        console.log(user);
    }
}