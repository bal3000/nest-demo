import { PipeTransform, BadRequestException } from "@nestjs/common";
import { TaskStatus } from "../task-status.enum";

export class TaskStatusValidationPipe implements PipeTransform {
    readonly allowedStatuses = [
        TaskStatus.OPEN,
        TaskStatus.INPROGRESS,
        TaskStatus.DONE
    ];

    transform(value: any) {
        if (value.status) {
            const status = value.status.toUpperCase();
            if (!this.isStatusValid(status)) {
                throw new BadRequestException(`${ status } is an invalid status`);
            }
            return value;
        }
        throw new BadRequestException(`Missing status`);
    }

    private isStatusValid(status: any) {
        const index = this.allowedStatuses.indexOf(status);
        return index !== -1;
    }
}