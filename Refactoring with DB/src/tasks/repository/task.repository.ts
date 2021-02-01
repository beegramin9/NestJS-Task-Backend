import { EntityRepository, Repository } from "typeorm";
import { CreateTaskDto } from "../dto/create-task.dto";
import { GetTaskFilterDto } from "../dto/get-task-filter.dto";
import { Task } from '../entity/task.entity';
import { TaskStatus } from "../entity/task-status.enum";

/* Repository는 NodeJS에서의 DB Module과 같다.
Service에서도 DB와의 interaction을 할 수는 있지만, 역할분담을
확실히 하기 위해서 따로 떼어놓음 */

/* @EntityRepository(인터랙션할 Table 이름)
Dependency Injection으로 Task Module에 inject할 것 */
@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
    async getTasks(filterDto: GetTaskFilterDto): Promise<Task[]> {
        /* 콘트롤러에서 @Query로 받을 때 GetTaskFilterDto로 걸러서 받는다.
        즉 url에 status이 없으면 자동적으로 undefined로 값이 정해짐 */
        const { status, search } = filterDto;
        console.log(status, search);
        /* createQueryBuilder는 Repository의 메소드
        task의 Repository이기 때문에 DB의 task 테이블과 Interact하는
        query를 만들 것이다.
        파라미터로 들어노는 task는 task entity */
        const query = this.createQueryBuilder('task');
        
        
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
        
        const tasks = await query.getMany();
        
        return tasks
    }


    async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
        const { title, description } = createTaskDto;

        const task = new Task();
        task.title = title;
        task.description = description;
        task.status = TaskStatus.OPEN;
        await task.save();

        return task;
    }
} 