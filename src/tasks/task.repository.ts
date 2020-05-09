import { Task } from "./entities/task.entity";
import { EntityRepository, Repository } from "typeorm";
import { CreateTaskDTO } from "./dto/create-task.dto";
import { TaskStatus } from "./task-status.enum";
import { GetTasksFilterDTO } from "./dto/get-tasks-filter.dto";
import { User } from "../auth/entities/user.entity";

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {

    public async createTask(createTaskDto: CreateTaskDTO, user: User): Promise<Task> {
        const { title, description } = createTaskDto;

        const task = new Task();
        task.title = title;
        task.description = description;
        task.status = TaskStatus.OPEN;
        task.user = user;
        await task.save();
        delete task.user;

        return task;    
    }

    public async getTasks(filterDto: GetTasksFilterDTO, user: User): Promise<Array<Task>> {
        const { status, search } = filterDto;
        const query = this.createQueryBuilder('task');
        query.where('task.userId = :userId', { userId: user.id });

        if (status) {
            query.andWhere('task.status = :status', { status });
        }

        if (search) {
            query.andWhere('task.title LIKE :search OR task.description LIKE :search', { search: `%${search}%` });
        }

        const tasks = await query.getMany();

        return tasks;
    }
} 