interface ISubTasks {
    [id: string]: ISubTask;
}

interface ISubTask {
    name: string;
    checked: boolean;
}

interface ISubTaskId {
    id: string;
    subTask: ISubTask;
}
