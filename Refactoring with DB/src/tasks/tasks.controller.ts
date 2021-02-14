import { Body, Controller, Param, Get, Post, Delete, Patch, Query, UsePipes, ValidationPipe, ParseIntPipe, UseGuards, Logger } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { TaskStatusValidationPipe } from 'src/tasks/pipes/task-status-validation.pipe';
import { Task } from './entity/task.entity';
import { TaskStatus } from './entity/task-status.enum';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/auth/entity/user.entity';
import { GetUser } from 'src/auth/decorator/get-user.decorator';


@Controller('tasks')
/* 이게 전체를 가드하는 방법 */
@UseGuards(AuthGuard())
export class TasksController {
    /* 여기 선언하면 TasksController 클래스 안에서 모두 사용 가능  */
    private logger = new Logger('TaskController');

    constructor(
        private tasksService: TasksService
    ) {}

    @Get()
    getTasks(
        @Query(ValidationPipe) filterDto: GetTaskFilterDto,
        @GetUser() user: User
        ): Promise<Task[]> {
        this.logger.verbose(`User "${user.username} retrieving all tasks. Filters: ${JSON.stringify(filterDto)}"`)
        return this.tasksService.getTask(filterDto, user);
    }
    
    @Post()
    @UsePipes(ValidationPipe)
    createTask(
        @Body() createTaskDto: CreateTaskDto,
        /* 내가 만든 custom decorator  */
        @GetUser() user: User,
        ): Promise<Task> {
        this.logger.verbose(`User "${user.username} creating a new task. Data: ${JSON.stringify(createTaskDto)}"`)
        return this.tasksService.createTask(createTaskDto, user);
    }

    @Get('/:id')
    /* id: number 에서 끝나면 TypeScript이 compile할 때만 먹히는 것
    실제 돌아갈 때(runtime)는 ParseIntPipe로 실제로 바꿔줘야 함 */
    getTaskById(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User
        ): Promise<Task> {
        /* 이건 숫자가 안 들어와, 아예 실행도 안 되는거야 */
        return this.tasksService.getTaskById(id, user);
    }

    /* parseIntPipe이 안 먹혀서 그런가? */
    @Delete('/:id')
    deleteTaskById(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User
        ): Promise<void> {
        return this.tasksService.deleteTaskById(id, user);
    }

    @Patch('/:id/status')
    updateTaskStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body('status', TaskStatusValidationPipe) status: TaskStatus,
        @GetUser() user: User
    ): Promise<Task> {
        return this.tasksService.updateTaskStatus(id, status, user);
    }

}

