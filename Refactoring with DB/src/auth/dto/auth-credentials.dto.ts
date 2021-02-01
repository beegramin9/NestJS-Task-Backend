import { IsString, MinLength, MaxLength, Matches } from "class-validator";

export class AuthCredentialsDto {
    /* 요기 데코레이터로 valition을 하려면 콘트롤러에 ValidationPipe 써야 함 */
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    username: string;

    @IsString()
    @MinLength(8)
    @MaxLength(20)
    /* 정규표현식 */
    @Matches(
        /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, 
        { message: "Password too weak."})
    password: string;
}