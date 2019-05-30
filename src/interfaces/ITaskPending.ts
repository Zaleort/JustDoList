interface PendingState {
    tasks: ITasksPending;
    completed: ITasksPending;
    current: ITaskPending;
    currentId: string;
}

interface ITasksPending {
    [id: string]: ITaskPending;
}

interface ITaskPending {
    name: string;
    notes: string;
    subTasks?: ISubTasks;
    tags?: {};
    completed?: boolean;
    dateCreated: number;
    dateUpdated: number;
    dateCompleted: number;
    dateDeadline: number;
}

interface ITaskPendingId {
    id: string;
    task: ITaskPending;
}
