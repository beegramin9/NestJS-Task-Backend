import { EntityRepository, Repository } from "typeorm";
import { User } from "../entity/user.entity";
import { AuthCredentialsDto } from "../dto/auth-credentials.dto";
import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import * as bcrypt from 'bcrypt';
import { setMaxListeners } from "process";

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        const { username, password } = authCredentialsDto;
        /* User 엔티티는 DB의 테이블임
        아래처럼 객체화시키는 건 한 행을 만드는 것과 같음 */

        /* DB에 쿼리를 두 번 날리기 때문에 좋지 않다. 
        const exists = this.findOne({username})
        if (exists) {
            //
        } */

        const salt = await bcrypt.genSalt();

        const user = new User();
        user.username = username;
        user.salt = salt;
        user.password = await this.hashPassword(password, salt);
        /* 한 번 */
        try {
            await user.save();
        } catch (error) {
            // console.log(error.code); 23505(문자열), buplicate username
            if (error.code === '23505') {
                throw new ConflictException('Username already exists.');
            } else {
                throw new InternalServerErrorException();
            }
        }
    }

    async validateUserPassword(authCredentialsDto: AuthCredentialsDto): Promise<string> {
        const { username, password } = authCredentialsDto;
        /* 여기서 this는 자기 자신인 userRepository를 가르키니 findOne 사용가능 */
        const user = await this.findOne({ username });
        /* ID를 바로 주는 게 아니라 object로 search criteria를 줄 수도 있음 */

        if (user && await user.validatePassword(password)) {
            return user.username;
        } else {
            /* 비밀번호가 다를 때
            null의 type도 string안가 보지? */
            return null;
        }
    }


    private async hashPassword(password: string, salt: String): Promise<string> {
        return await bcrypt.hash(password, salt)
    }
}