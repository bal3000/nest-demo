import { Controller, Get, Post, Body } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './task.model';
import { CreateTaskDTO } from './dto/create-task.dto';

@Controller('tasks')
export class TasksController {
    constructor(private taskService: TasksService) {}

    @Get()
    public getAllTasks(): Array<Task> {
        return this.taskService.getAllTasks();
    }

    @Post()
    public createTask(@Body() task: CreateTaskDTO): Task {
        return this.taskService.createTask(task);
    }
}
