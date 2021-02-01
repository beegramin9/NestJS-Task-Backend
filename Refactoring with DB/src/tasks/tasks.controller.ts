import { Body, Controller, Param, Get, Post, Delete, Patch, Query, UsePipes, ValidationPipe, ParseIntPipe } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { TaskStatusValidationPipe } from 'src/tasks/pipes/task-status-validation.pipe';
import { Task } from './entity/task.entity';
import { TaskStatus } from './entity/task-status.enum';


@Controller('tasks')
export class TasksController {
    constructor(
        private tasksService: TasksService
    ) {}

    @Get()
    getTasks(@Query(ValidationPipe) filterDto: GetTaskFilterDto): Promise<Task[]> {
        return this.tasksService.getTask(filterDto);
    }
    
    @Post()
    @UsePipes(ValidationPipe)
    createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
        /* 여긴 잘 들어와. 숫자가 잘 들어오네 */
        return this.tasksService.createTask(createTaskDto);
    }

    @Get('/:id')
    /* id: number 에서 끝나면 TypeScript이 compile할 때만 먹히는 것
    실제 돌아갈 때(runtime)는 ParseIntPipe로 실제로 바꿔줘야 함 */
    getTaskById(@Param('id', ParseIntPipe) id: number): Promise<Task> {
        /* 이건 숫자가 안 들어와, 아예 실행도 안 되는거야 */
        return this.tasksService.getTaskById(id);
    }

    /* parseIntPipe이 안 먹혀서 그런가? */
    @Delete('/:id')
    deleteTaskById(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.tasksService.deleteTaskById(id);
    }

    @Patch('/:id/status')
    updateTaskStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body('status', TaskStatusValidationPipe) status: TaskStatus
    ): Promise<Task> {
        return this.tasksService.updateTaskStatus(id, status);
    }

}

