import { TypeOrmModuleOptions } from "@nestjs/typeorm";
/* nodejs DB에 커넥할 때 사용되는 json파일 같은 타입임 */

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    /* 비밀번호 이상하게 해놨네... */
    password: 'wtchoe13',
    database: 'taskmanagement',
    /* Entity는 table을 DB로 바꿔주는데, 파일에 저장되어 있다. 
    This change will ensure that the file extensions used by TypeORM are both .js and .ts 
    (unlike in the video, where I only used .ts). */
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    synchronize: true
};