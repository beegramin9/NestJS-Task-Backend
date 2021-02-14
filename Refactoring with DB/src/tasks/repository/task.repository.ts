import { EntityRepository, Repository } from "typeorm";
import { CreateTaskDto } from "../dto/create-task.dto";
import { GetTaskFilterDto } from "../dto/get-task-filter.dto";
import { Task } from '../entity/task.entity';
import { User } from '../../auth/entity/user.entity';
import { TaskStatus } from "../entity/task-status.enum";
import { InternalServerErrorException, Logger } from '@nestjs/common';

/* Repository는 NodeJS에서의 DB Module과 같다.
Service에서도 DB와의 interaction을 할 수는 있지만, 역할분담을
확실히 하기 위해서 따로 떼어놓음 */

/* @EntityRepository(인터랙션할 Table 이름)
Dependency Injection으로 Task Module에 inject할 것 */
@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {

    private logger = new Logger('TaskRepository');

    async getTasks(
        filterDto: GetTaskFilterDto,
        user :User
        ): Promise<Task[]> {
        /* 콘트롤러에서 @Query로 받을 때 GetTaskFilterDto로 걸러서 받는다.
        즉 url에 status이 없으면 자동적으로 undefined로 값이 정해짐 */
        const { status, search } = filterDto;
        /* createQueryBuilder는 Repository의 메소드
        task의 Repository이기 때문에 DB의 task 테이블과 Interact하는
        query를 만들 것이다.
        파라미터로 들어노는 task는 task entity */
        const query = this.createQueryBuilder('task');
        
        /* DB에 user의 ID가 userId 라는 column에 들어가 있음
        (내가 만든 기억 없음, TypeORm에서 자동으로 만든 것
        그렇기때문에 task Entity에 추가해줘야함)
        그래서 where절로 user.id에 맞는 애들 다 데려올 것 */
        query.where('task.userId = :userId', { userId : user.id})
        
        if (status) {
            /* DB query의 Where절 
            status = OPEN 을 찾고싶으면 status: OPEN으로 하면 됨
            근데 여기선 status를 client에게서 받을것이기 때문에, ES6 문법으로 그냥 status로 두는 것*/
            query.andWhere('task.status = :status', { status });
        }
        
        if (search) {
            /* justWhere은 여러개 있으면 override해서 맨 마지막것만 됨
            그래서 status랑 search 둘 다 하려면 andWhere을 사용해야 함
            각 where 절을 if문이라고 생각하면 편한데, search랑 description에 둘다 먹히길 바라기에
            바깥을 ()로 감싸줌 */
            query.andWhere('(task.title LIKE :search OR task.description LIKE :search)', { search: `%${search}%` });
        }
        
        try {
            const tasks = await query.getMany();
            return tasks;
        } catch (error) {
            this.logger.error(`Failed to get tasks for user "${user.username}", DTO : ${JSON.stringify(filterDto)}`, error.stack);
            throw new InternalServerErrorException();
        }
        
    }


    async createTask(
        createTaskDto: CreateTaskDto, 
        user: User
        ): Promise<Task> {
        const { title, description } = createTaskDto;

        const task = new Task();
        task.title = title;
        task.description = description;
        task.status = TaskStatus.OPEN;
        /* Task Entity의 User 열에 파라미터로 들어온
        user를 넣어주기 */
        task.user = user;
        try {
            await task.save();

        } catch (error) {
            this.logger.error(`Failed to create a task for user "${user.username}", DAta : ${JSON.stringify(createTaskDto)}`, error.stack);
            throw new InternalServerErrorException();
        }

        /* createTask를 하면 user의 모든 정보가 들어온다.
        그래서 너무 sensitive한 정보가 들어오면 안 좋으니까
        없애는 거야
        저장을 이미 위에서 했으므로 DB에는 문제없이 들어간다. */
        delete task.user;


        return task;
    }
} 