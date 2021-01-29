import { Body, Controller, Param, Get, Post, Delete, Patch, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task, TaskStatus } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { TaskStatusValidationPipe } from 'src/tasks/pipes/task-status-validation.pipe';

@Controller('tasks')
export class TasksController {
    /* Dependency Inject Import는 JS Class Constructor를 선언함으로써 가능
    Serivcedml TaskSerivce 클래스의 taskService 객체를 Instantiation했으므로
    여기서 this.taskService로 자유롭게 사용 가능 */
    constructor(private taskService: TasksService) {}

    /* /tasks의 모든 Get요청은 여기서 */
    @Get()
    getTasks(@Query(ValidationPipe) filterDto: GetTaskFilterDto): Task[] {
        /* filterDto는 Object 형태임 
        console.log(filterDto); */

        /* 따로 search 항목이 있는 Query가 들어오면 
        getTasksWithFilters()를, 따로 없으면 getAllTasks()를 */
        if (Object.keys(filterDto).length) {
            return this.taskService.getTasksWithFilters(filterDto);
        } else {
            return this.taskService.getAllTasks();
        }
    }

    @Post()
    /* Handler-level Pipe
    Post에 들어오는 Validation Decorator(=IsNotEmpty)가 붙은 모든 것을 검열 */
    @UsePipes(ValidationPipe)
    createTask(/* @Body() body */
        /* 아래처럼 하지 않고 */
        @Body() createTaskDto: CreateTaskDto
        
        /* @Body('title') title: string,
        @Body('description') description: string */

        /* 요건 body에 한번에 넣지 않고 따로따로 넣는 것
        @Body() 안의 string은 key-value 구조의 key
         */
    ): CreateTaskDto {
        /* 1번째 방법:
        Body 편지에 title, description 등 받아와야 할 게 있음
        @Body 사용하면 NestJS가 편지 안의 모든 내용을 body 변수에 넣는다. */
        
        /* service의 create 메소드를 가져와서 task를 만들고 client에게 돌려줌 */
        return this.taskService.createTask(createTaskDto);
        
    }

    @Get('/:id')
    getTaskById(@Param('id') id: string): Task {
        return this.taskService.getTaskById(id);
    }

    @Delete('/:id')
    deleteTaskById(@Param('id') id: string): boolean {
        return this.taskService.deleteTaskById(id);
    }


    @Patch('/:id/status')
    updateTaskStatusById(
        @Param('id') id:string,
        @Body('status',TaskStatusValidationPipe) status: TaskStatus )
        : Task {
        return this.taskService.updateTaskStatusById(id, status);
    }
}

