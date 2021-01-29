import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';

@Injectable()
export class TasksService {
    /* private은 바깥에서 이 클래스 속성을 바꿀 수 없게끔 */
    private tasks: Task[] = [];

    getAllTasks(): Task[] {
        return this.tasks;
    }

    getTaskById(id: string): Task {
        /* 있는 id만 가져올 수 있게 */
        const found = this.tasks.find(task => task.id === +id)
        if (!found) {
            throw new NotFoundException(`Task with ${id} not found.`);
        }
        return found;
    }

    getTasksWithFilters(filterDto: GetTaskFilterDto): Task[] {
        const { status, search } = filterDto;

        let tasks = this.getAllTasks();

        /* status가 filterDto에 있다면, 그니까 쿼리로 들어왔으면 */
        if (status) {
            /* 쿼리로 들어온 status를 가진 애들만 return */
            tasks = tasks.filter(task => task.status === status)
        }
        if (search) {
            tasks = tasks.filter(task => 
                /* search를 가지고 있으면 true return하고, true로 return 된 애들만 가져온다 */
                task.title.includes(search) ||
                task.description.includes(search) 
                );       
        }

        return tasks;
    }

    createTask(createTaskDto): CreateTaskDto {
        const {title, description} =  createTaskDto;

        const task: Task = {
            /* ID 생성 패키지 uuid */
            id: this.tasks.length + 1,
            title,
            description,
            status: TaskStatus.OPEN
        };
        this.tasks.push(task);
        /* 새롭게 만들어진 task를 return하지 않으면
        프론트엔드에서는 getAllTask()로 전체를 한 번 가져와야함
        그래서 백엔드에서 알아서 만들자마자 return해주면
        프론트엔드에서 새로고침이나 요청을 한번 더 할 필요 없음 */
        return task;
    }
 
    deleteTaskById(id: string): boolean {
        /* 없는 ID를 지우려고 하면 아래 단계에서 에러가 먼저 발생한다. */
        const found = this.getTaskById(id);

        this.tasks = this.tasks.filter(task => task.id !== found.id);
        return true;
    }

    updateTaskStatusById(id: string, status: TaskStatus): Task {
        const task = this.getTaskById(id);
        task.status = status;
        return task
    }
}
