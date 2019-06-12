interface DailyState {
    tasks: ITasksDaily;
    current: ITaskDaily;
    currentId: string;
}

interface ITasksDaily {
    [id: string]: ITaskDaily;
}

interface ITaskDaily {
    name: string;
    notes?: string;
    subTasks?: ISubTasks;
    tags?: ITagArray;
    favoriteTag?: string;
    frecuency?: string;
    streak: number;
    completed?: boolean;
    dateCreated?: number | null;
    dateUpdated?: number | null;
    dateCompleted?: number | null;
    dateLastCompleted?: number | null;
}

interface ITaskDailyId {
    id: string;
    task: ITaskDaily;
}
