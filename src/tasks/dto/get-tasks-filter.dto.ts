import { TaskStatus } from "../task.model";
import { IsOptional, IsIn, IsNotEmpty } from "class-validator";

export class GetTasksFilterDTO {
    @IsOptional()
    @IsIn([ TaskStatus.OPEN, TaskStatus.INPROGRESS, TaskStatus.DONE])
    status: TaskStatus;

    @IsOptional()
    @IsNotEmpty()
    search: string;
}