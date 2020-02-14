import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import * as uuid from 'uuid/v1'
import { CreateTaskDTO } from './dto/create-task.dto';
import { UpdateTaskDTO } from './dto/update-task.dto';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
    private tasks: Array<Task> = [];

    public getAllTasks(): Array<Task> {
        return this.tasks;
    }

    public getTasks(filter: GetTasksFilterDTO): Array<Task> {
        const { search, status } = filter;
        let tasks = this.getAllTasks();

        if (status) {
            tasks = tasks.filter((task) => task.status === status);
        }
        if (search) {
            tasks = tasks.filter((task) => task.title.includes(search) || task.description.includes(search));
        }

        return tasks;
    }

    public getTasksById(id: string): Task {
        return this.tasks.find((t) => t.id === id);
    }

    public createTask(newTask: CreateTaskDTO): Task {
        const { title, description } = newTask;

        const task: Task = {            
            id: uuid(),
            title,
            description,
            status: TaskStatus.OPEN
        };

        this.tasks.push(task);
        return task;
    }

    public deleteTaskById(id: string): boolean {
        const idToDelete = this.tasks.findIndex((t) => t.id === id);
        if (idToDelete > -1) {
            this.tasks.splice(idToDelete, 1);
            return true;
        } else {
            return false;
        }
    }
    
    public updateTaskById(id: string, updateTask: UpdateTaskDTO): Task {
        const task = this.getTasksById(id);
        if (task) {
            task.status = updateTask.status;
            return task;
        } else {
            return null;
        }
    }
}
