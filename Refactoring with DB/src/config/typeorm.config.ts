import { TypeOrmModuleOptions } from "@nestjs/typeorm";
/* nodejs DB에 커넥할 때 사용되는 json파일 같은 타입임 */
import * as config from 'config';

const dbConfig = config.get('db');

/* RDS 환경변수는 아마존에서 지원하는 환경변수
앱이 배포되면 아마존이 이걸 읽고 값을 변수에 넣기 떄문에
이름이 똑같아야 함 */

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: dbConfig.type,
    host: process.env.RDS_HOSTNAME || dbConfig.host,
    port: process.env.RDS_PORT || dbConfig.port,
    username: process.env.RDS_USERNAME || dbConfig.username ,
    /* 비밀번호 이상하게 해놨네... */
    password: process.env.RDS_PASSWORD || dbConfig.password ,
    database: process.env.RDS_DB_NAME || dbConfig.database ,
    /* Entity는 table을 DB로 바꿔주는데, 파일에 저장되어 있다. 
    This change will ensure that the file extensions used by TypeORM are both .js and .ts 
    (unlike in the video, where I only used .ts). */
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    /* development 모드일때만 true여야 한다.
    runtime에서 DB에 조작이 가해질 때마다 DB가 유동적으로 따라온다
    근데 production, 배포할 때는 좋지 않겠지. */
    synchronize: process.env.TYPEORM_SYNC || dbConfig.synchronize
};