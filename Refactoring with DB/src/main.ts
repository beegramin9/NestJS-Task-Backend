import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import * as config from 'config';


async function bootstrap() {
  /* 아규먼트로 정보를 줄 수 있음. 여기선 bootstrap 함수 안이니까
  bootstrap으로 할 수 있음 */
  const logger = new Logger("bootstrap");
  
  /* 어떻게 config가 경로를 아는거지?
  NODE_ENV 환경변수를 이용하는데, default값이 development configuration임 */
  const serverConfig = config.get('server');

  const app = await NestFactory.create(AppModule);

  if (process.env.NODE_ENV === 'development') {
    app.enableCors();
  } 
  
  /* port가 따로 정해진게 있으면 그걸 쓰고, 없어서 
  앞이 false가 되면 뒤에걸 쓴다. */
  const port = process.env.PORT || serverConfig.port;
  await app.listen(port);
  /* 앱 시작한 뒤에 로깅하는데 말이 맞지? */
  logger.log(`Application listening on port ${port}`)

}
bootstrap();
