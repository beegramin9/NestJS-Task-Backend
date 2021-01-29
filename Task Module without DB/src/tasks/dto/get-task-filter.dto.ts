import { fromEventPattern } from "rxjs";
import { TaskStatus } from '../task.model';
import { IsIn, IsNotEmpty, IsOptional } from 'class-validator';

export class GetTaskFilterDto {
    @IsOptional()
    @IsIn([TaskStatus.OPEN, TaskStatus.IN_PROGRESS, TaskStatus.DONE])
    /* Checks if the value is in an array of allowed values. */ 
    status: TaskStatus;

    @IsOptional()
    @IsNotEmpty()
    search: string;
}