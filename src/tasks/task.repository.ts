import { Task } from "./entities/task.entity";
import { EntityRepository, Repository } from "typeorm";
import { CreateTaskDTO } from "./dto/create-task.dto";
import { TaskStatus } from "./task-status.enum";
import { GetTasksFilterDTO } from "./dto/get-tasks-filter.dto";

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {

    public async createTask(createTaskDto: CreateTaskDTO): Promise<Task> {
        const { title, description } = createTaskDto;

        const task = new Task();
        task.title = title;
        task.decription = description;
        task.status = TaskStatus.OPEN;
        await task.save();

        return task;    
    }

    public async getTasks(filterDto: GetTasksFilterDTO): Promise<Array<Task>> {
        const { status, search } = filterDto;
        const query = this.createQueryBuilder('task');
        
        const tasks = await query.getMany();

        return tasks;
    }
} 