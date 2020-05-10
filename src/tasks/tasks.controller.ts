import { Controller, Get, Post, Body, Param, Delete, Patch, Query, UsePipes, ValidationPipe, ParseIntPipe, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDTO } from './dto/create-task.dto';
import { UpdateTaskDTO } from './dto/update-task.dto';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { Task } from './entities/task.entity';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../auth/entities/user.entity';
import { GetUser } from '../auth/utils/get-user.decorator';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    constructor(private taskService: TasksService) {}

    @Get()
    public getTasks(@Query(ValidationPipe) filter: GetTasksFilterDTO, @GetUser() user: User): Promise<Array<Task>> {
        return this.taskService.getTasks(filter, user);
    }

    @Get('/:id') 
    public getTask(@Param('id', ParseIntPipe) id: number, @GetUser() user: User): Promise<Task> {
        return this.taskService.getTasksById(id, user);
    }

    @Post()
    @UsePipes(ValidationPipe)
    public createTask(@Body() task: CreateTaskDTO, @GetUser() user: User): Promise<Task> {
        return this.taskService.createTask(task, user);
    }

    @Delete('/:id')
    public deleteTask(@Param('id', ParseIntPipe) id: number, @GetUser() user: User): Promise<boolean> {
        return this.taskService.deleteTaskById(id, user);
    }

    @Patch('/:id/status')
    public updateTask(
        @Param('id', ParseIntPipe) id: number, 
        @Body(TaskStatusValidationPipe) task: UpdateTaskDTO,
        @GetUser() user: User
    ): Promise<Task> {
        return this.taskService.updateTaskById(id, task, user);
    }
}
