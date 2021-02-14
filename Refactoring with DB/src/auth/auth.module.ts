import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserRepository } from './repository/user.repository';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt/jwt-strategy';
import { TasksModule } from 'src/tasks/tasks.module';
import * as config from 'config';

const jwtConfig = config.get('jwt');


@Module({
  imports: [
    /* TypeORM을 사용할것이기때문에 여기서 Import 하고,
    forFeature([엔티티 or 리포지토리]) */
    TypeOrmModule.forFeature([UserRepository]),
    /* 나중에 package.json 가져와서 npm install 한다해도 여기서 JwtModule import 해야 함! */
    JwtModule.register({ /* register로 call하고 configuration 줘야 함 */
      secret: process.env.JWT_SECRET || jwtConfig.secret,
      signOptions: {
        expiresIn: jwtConfig.expiresIn 
      }
    }),
    PassportModule.register({defaultStrategy:'jwt'})
  ],
  controllers: [AuthController],
  /* provider에는 그냥 service가 들어오는 곳이라고 생각하면 편하다. */
  providers: [
    AuthService,
    JwtStrategy
  ],
  /* exports로 들어가면, AuthModule 말고도 다른 모듈(TaskModule)
  에서도 사용 가능
  AuthModule에서 export된 모듈을 TaskModule에서 import해서 사용  */
  exports: [
    JwtStrategy,
    PassportModule
  ]
})
export class AuthModule {}
