import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import * as uuid from 'uuid/v1'

@Injectable()
export class TasksService {
    private tasks: Array<Task> = [];

    public getAllTasks(): Array<Task> {
        return this.tasks;
    }

    public createTask(title: string, description: string): Task {
        const task: Task = {            
            id: uuid(),
            title,
            description,
            status: TaskStatus.OPEN
        };

        this.tasks.push(task);
        return task;
    }
}
