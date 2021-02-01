import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserRepository } from './repository/user.repository';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    /* TypeORM을 사용할것이기때문에 여기서 Import 하고,
    forFeature([엔티티 or 리포지토리]) */
    TypeOrmModule.forFeature([UserRepository]),
    /* 나중에 package.json 가져와서 npm install 한다해도 여기서 JwtModule import 해야 함! */
    JwtModule.register({ /* register로 call하고 configuration 줘야 함 */
      secret: 'topSecret51',
      signOptions: {
        expiresIn: 3600 /* 1Hr */
      }
    }),
    PassportModule.register({defaultStrategy:'jwt'})
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
