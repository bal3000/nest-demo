import { Controller, Get, Post, Body, Param, Delete, Patch, Query, UsePipes, ValidationPipe, ParseIntPipe, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDTO } from './dto/create-task.dto';
import { UpdateTaskDTO } from './dto/update-task.dto';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { Task } from './entities/task.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    constructor(private taskService: TasksService) {}

    @Get()
    public getTasks(@Query(ValidationPipe) filter: GetTasksFilterDTO): Promise<Array<Task>> {
        return this.taskService.getTasks(filter);
    }

    @Get('/:id')
    public getTask(@Param('id', ParseIntPipe) id: number): Promise<Task> {
        return this.taskService.getTasksById(id);
    }

    @Post()
    @UsePipes(ValidationPipe)
    public createTask(@Body() task: CreateTaskDTO): Promise<Task> {
        return this.taskService.createTask(task);
    }

    @Delete('/:id')
    public deleteTask(@Param('id', ParseIntPipe) id: number): Promise<boolean> {
        return this.taskService.deleteTaskById(id);
    }

    @Patch('/:id/status')
    public updateTask(@Param('id', ParseIntPipe) id: number, @Body(TaskStatusValidationPipe) task: UpdateTaskDTO): Promise<Task> {
        return this.taskService.updateTaskById(id, task);
    }
}
