import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDTO } from './dto/create-task.dto';
import { UpdateTaskDTO } from './dto/update-task.dto';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class TasksService {
    
    constructor(@InjectRepository(TaskRepository) private taskRepo: TaskRepository) {}

    public async getTasks(filter: GetTasksFilterDTO, user: User): Promise<Array<Task>> {
        return this.taskRepo.getTasks(filter, user);
    }

    public async getTasksById(id: number, user: User): Promise<Task> {
        const found = await this.taskRepo.findOne({ where: { id, userId: user.id }});

        if (!found) {
            throw new NotFoundException(`Task with ID ${id} could not be found`);
        }

        return found;
    }

    public async createTask(newTask: CreateTaskDTO, user: User): Promise<Task> {
       return this.taskRepo.createTask(newTask, user);
    }

    public async deleteTaskById(id: number, user: User): Promise<boolean> {
        const deleted = await this.taskRepo.delete({ id, userId: user.id });
        if (deleted.affected) {
            return true;
        } else {
            throw new NotFoundException(`Task with ID ${id} could not be found`);
        }
    }
    
    public async updateTaskById(id: number, updateTask: UpdateTaskDTO, user: User): Promise<Task> {
        const task = await this.getTasksById(id, user);
        if (task) {
            task.status = updateTask.status;
            await task.save();
            return task;
        } else {
            throw new NotFoundException(`Task with ID ${id} could not be found`);
        }
    }
}
