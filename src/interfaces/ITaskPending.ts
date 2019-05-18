interface ITasksPending {
    [id: string]: ITaskPending;
}

interface ITaskPending {
    name: string;
    notes: string;
    subTasks?: ISubTasks;
    tags?: {};
}

interface ITaskPendingId {
    id: string;
    task: ITaskPending;
}
