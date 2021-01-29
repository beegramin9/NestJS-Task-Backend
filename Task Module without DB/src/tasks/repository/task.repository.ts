import { EntityRepository, Repository } from "typeorm";
import { Task } from '../entity/task.entity';

/* Dependency Injection으로 Task Module에 inject할 것 */
@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {

} 