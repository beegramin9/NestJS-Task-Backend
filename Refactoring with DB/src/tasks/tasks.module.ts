import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { TaskRepository } from './repository/task.repository';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

@Module({
  imports: [
    /* 앱모듈에서는 forRoot으로 불렀지만 여기서는
    앱모듈에서 이미 connection을 define했기 때문에
    forFeature로 부른다.
    [] 안에는 이 모델 시스템에 포함하고 싶은
    entity나 repos을 넣는다. */
    TypeOrmModule.forFeature([TaskRepository]),
    /* AuthModule이 export 하는 모든 것은 TaskModule에서 available */
    AuthModule
  ],
  controllers: [TasksController],
  providers: [TasksService]
  /* provider에 TaskService가 Dependency Inject로 Inject가 되었으므로
  같은 TaskModule 내에서 언제든지 불러서 사용 가능
  이때는 @inject 없이 그냥 constructor 안에 불러오기만 하면 됨 */
})
export class TasksModule {}
