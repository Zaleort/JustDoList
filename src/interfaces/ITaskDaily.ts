interface ITaskDaily {
    id: string;
    name: string;
    notes: string;
    subTasks: ISubTask[];
    subTaskId: number;
    tags: string[];
}
