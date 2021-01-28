import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";
import { Task, TaskStatus } from '../task.model';

export class TaskStatusValidationPipe implements PipeTransform {
    readonly allowedStatuses = [
        TaskStatus.OPEN,
        TaskStatus.IN_PROGRESS,
        TaskStatus.DONE,
    ];
    
    
    /* NestJS로부터 불려와서 Validation을 Handle하게 될 것
    value, metadata 두 개 파라미터를 받는다. */
    transform(value: any, metadata: ArgumentMetadata) {
        value = value.toUpperCase();

        if (!this.isStatusValid(value)) {
            throw new BadRequestException(`${value} is an invalid status`);
        }
        return value;
    }

    private isStatusValid(status:any): boolean {
        /* status가 해당 Array의 몇 번째 인덱스 요소인지 알려줌
        만약 Array의 요소가 아니라면, -1을 리턴함 */
        const idx = this.allowedStatuses.indexOf(status);
        return idx !== -1
    }
}