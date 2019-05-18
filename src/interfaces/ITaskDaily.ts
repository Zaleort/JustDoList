interface ITasksDaily {
    [id: string]: ITaskDaily;
}

interface ITaskDaily {
    name: string;
    notes?: string;
    subTasks?: ISubTasks;
    tags: {};
    frecuency?: string;
    streak?: number;
    completed?: boolean;
    dateCreated?: Date | null;
    dateUpdated?: Date | null;
    dateCompleted?: Date | null;
    dateLastCompleted?: Date | null;
}

interface ITaskDailyId {
    id: string;
    task: ITaskDaily;
}
