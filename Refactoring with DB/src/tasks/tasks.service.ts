import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { TaskRepository } from './repository/task.repository';
import { Task } from './entity/task.entity';
import { User } from '../auth/entity/user.entity';
import { TaskStatus } from './entity/task-status.enum';


@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository,
    ) {}

    async getTask(
        filterDto: GetTaskFilterDto,
        user: User
        ): Promise<Task[]> {
        return this.taskRepository.getTasks(filterDto, user);
    }


    async getTaskById(
        id: number,
        user: User
        ): Promise<Task> {
            /* findOne 안에 오브젝트를 줘서 쿼리를 선택 가능(여기선 where절) */
        const found = await this.taskRepository.findOne( { where: { id, userId: user.id } } );
        if (!found) {
            throw new NotFoundException(`Task with ID ${id} not found.`);
        }
        return found;
    }

    async createTask(
        createTaskDto: CreateTaskDto,
        user: User
        ): Promise<Task> {
        return await this.taskRepository.createTask(createTaskDto, user);
    }

    async deleteTaskById(
        id: number,
        user: User
        ): Promise<void> {
            /* delete도 findOne처럼 Object로 파라미터를 받을 수 있다
            근데 where처럼 query를 명시하진 않는다. 걍 문법이 그렇게 되어있음  */
        const result = await this.taskRepository.delete({ id, userId: user.id} );
        /* the number of affected, 0이면 하나도 안 지워진거고 1이상이면 몇개 지워진거 */
        if (result.affected === 0) {
            throw new NotFoundException(`Task with ID ${id} not found.`);
        }
    }

    async updateTaskStatus(
        id: number, 
        status: TaskStatus,
        user: User
        ): Promise<Task> {
        /* getTaskById를 한 번 더 사용하면 오류도 알아서 throw한다. */
        const task = await this.getTaskById(id, user);
        task.status = status;
        /* update를 할 때 요건 국지적으로 요 안에 있는 task에만 적용되므로
        따로 save() 해줘야 함. 모든 entity(여기선 Task)엔 save()이 있음. async operation임 */
        await task.save();
        return task
    }
}
