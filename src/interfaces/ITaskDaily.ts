interface ITaskDaily {
    id: string;
    name: string;
    notes?: string;
    subTasks?: ISubTask[];
    subTaskId?: number;
    tags?: string[];
    frecuency?: string;
    streak?: number;
    completed?: boolean;
    dateCreated?: Date | null;
    dateUpdated?: Date | null;
    dateCompleted?: Date | null;
    dateLastCompleted?: Date | null;
}
