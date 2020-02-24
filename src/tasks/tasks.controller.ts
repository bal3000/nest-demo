import { Controller, Get, Post, Body, Param, Delete, Patch, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './task.model';
import { CreateTaskDTO } from './dto/create-task.dto';
import { UpdateTaskDTO } from './dto/update-task.dto';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';

@Controller('tasks')
export class TasksController {
    constructor(private taskService: TasksService) {}

    @Get()
    public getTasks(@Query(ValidationPipe) filter: GetTasksFilterDTO): Array<Task> {
        if (Object.keys(filter).length) {
            return this.taskService.getTasks(filter);
        } else {
            return this.taskService.getAllTasks();
        }
    }

    @Get('/:id')
    public getTask(@Param('id') id: string): Task {
        return this.taskService.getTasksById(id);
    }

    @Post()
    @UsePipes(ValidationPipe)
    public createTask(@Body() task: CreateTaskDTO): Task {
        return this.taskService.createTask(task);
    }

    @Delete('/:id')
    public deleteTask(@Param('id') id: string): boolean {
        return this.taskService.deleteTaskById(id);
    }

    @Patch('/:id/status')
    public updateTask(@Param('id') id: string, @Body(TaskStatusValidationPipe) task: UpdateTaskDTO): Task {
        return this.taskService.updateTaskById(id, task);
    }
}
