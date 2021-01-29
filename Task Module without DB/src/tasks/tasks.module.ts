import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
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
    TypeOrmModule.forFeature([TaskRepository])
  ],
  controllers: [TasksController],
  providers: [TasksService]
  /* provider에 TaskService가 Dependency Inject로 Inject가 되었으므로
  이제 같은 Task 모듈에 있는 Task Controller에 Provide 가능 */
})
export class TasksModule {}
