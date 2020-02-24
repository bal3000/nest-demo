import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDTO } from './dto/create-task.dto';
import { UpdateTaskDTO } from './dto/update-task.dto';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksService {
    
    constructor(@InjectRepository(TaskRepository) private taskRepo: TaskRepository) {}

    public async getTasks(filter: GetTasksFilterDTO): Promise<Array<Task>> {
        return this.taskRepo.getTasks(filter);
    }

    public async getTasksById(id: number): Promise<Task> {
        const found = await this.taskRepo.findOne(id);

        if (!found) {
            throw new NotFoundException(`Task with ID ${id} could not be found`);
        }

        return found;
    }

    public async createTask(newTask: CreateTaskDTO): Promise<Task> {
       return this.taskRepo.createTask(newTask);
    }

    public async deleteTaskById(id: number): Promise<boolean> {
        const deleted = await this.taskRepo.delete(id);
        if (deleted.affected) {
            return true;
        } else {
            throw new NotFoundException(`Task with ID ${id} could not be found`);
        }
    }
    
    public async updateTaskById(id: number, updateTask: UpdateTaskDTO): Promise<Task> {
        const task = await this.getTasksById(id);
        if (task) {
            task.status = updateTask.status;
            await task.save();
            return task;
        } else {
            throw new NotFoundException(`Task with ID ${id} could not be found`);
        }
    }
}
