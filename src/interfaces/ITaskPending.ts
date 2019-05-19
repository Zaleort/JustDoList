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
    dateCreated?: number | null;
    dateUpdated?: number | null;
    dateCompleted?: number | null;
    dateDeadline?: number | null;
}

interface ITaskPendingId {
    id: string;
    task: ITaskPending;
}
