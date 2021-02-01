import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { TaskRepository } from './repository/task.repository';
import { Task } from './entity/task.entity';
import { TaskStatus } from './entity/task-status.enum';


@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository,
    ) {}

    async getTask(filterDto: GetTaskFilterDto): Promise<Task[]> {
        return this.taskRepository.getTasks(filterDto);
    }


    async getTaskById(id: number): Promise<Task> {
        const found = await this.taskRepository.findOne(id);
        if (!found) {
            throw new NotFoundException(`Task with ID ${id} not found.`);
        }
        return found;
    }

    async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
        return await this.taskRepository.createTask(createTaskDto);
    }

    async deleteTaskById(id: number): Promise<void> {
        const result = await this.taskRepository.delete(id);
        /* the number of affected, 0이면 하나도 안 지워진거고 1이상이면 몇개 지워진거 */
        if (result.affected === 0) {
            throw new NotFoundException(`Task with ID ${id} not found.`);
        }
    }

    async updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
        /* getTaskById를 한 번 더 사용하면 오류도 알아서 throw한다. */
        const task = await this.getTaskById(id);
        task.status = status;
        /* update를 할 때 요건 국지적으로 요 안에 있는 task에만 적용되므로
        따로 save() 해줘야 함. 모든 entity(여기선 Task)엔 save()이 있음. async operation임 */
        await task.save();
        return task
    }
}
