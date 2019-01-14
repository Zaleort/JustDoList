import Vue from 'vue';
import '../interfaces/ITaskDaily';

/*
    Módulo de las Tareas Diarias. Aquí se almacenará en un array las tareas disponibles
    y contendrá las mutaciones para las operaciones CRUD.

    Dentro de las acciones se hacen llamadas AJAX para actualizar los datos en la BD
*/

export default {
    namespaced: true,
    state: {
        tasks: [] as ITaskDaily[],
        idCounter: '0',
        current: {
            id: '',
            name: '',
            notes: '',
            subTasks: [],
            subTaskId: 0,
        } as ITaskDaily,
    },

    mutations: {
        INCREASE_ID_COUNTER(state: any) {
            let id = state.idCounter;
            id++;
            state.idCounter = id.toString();
        },

        ADD_TASK(state: any, task: ITaskDaily) {
            state.tasks.push(task);
        },

        UPDATE_TASK(state: any, task: ITaskDaily) {
            const i = state.tasks.findIndex((e: ITaskDaily) => {
                return e.id === task.id;
            });

            if (i >= 0) {
                Vue.set(state.tasks, i, task);
            }
        },

        COMPLETE_TASK(state: any, id: string) {
            const i = state.tasks.findIndex((e: ITaskDaily) => {
                return e.id === id;
            });

            state.tasks.splice(i, 1);
        },

        MOVE_TASK_UP(state: any, id: string) {
            if (!state.tasks || state.tasks.length === 0) { return; }

            const i = state.tasks.findIndex((e: ITaskPending) => {
                return e.id === id;
            });

            if ((i - 1) < 0) { return; }

            state.tasks.splice(i - 1, 0, state.tasks.splice(i, 1)[0]);
        },

        MOVE_TASK_DOWN(state: any, id: string) {
            if (!state.tasks || state.tasks.length === 0) { return; }

            const i = state.tasks.findIndex((e: ITaskPending) => {
                return e.id === id;
            });

            if ((i + 1) >= state.tasks.length) { return; }

            state.tasks.splice(i + 1, 0, state.tasks.splice(i, 1)[0]);
        },

        UPDATE_SUBTASK_CHECK(state: any, payload: any) {
            const i = state.tasks.findIndex((e: ITaskDaily) => {
                return e.id === payload.taskId;
            });

            if (i >= 0) {
                const j = state.tasks[i].subTasks.findIndex((e: ISubTask) => {
                    return e.id === payload.id;
                });

                if (j >= 0) {
                    state.tasks[i].subTasks[j].checked = payload.checked;
                }
            }
        },

        UPDATE_CURRENT_TASK(state: any, task: ITaskDaily) {
            state.current = task;
        },

        INCREASE_CURRENT_SUBTASK_COUNTER(state: any) {
            state.current.subTaskId++;
        },

        ADD_CURRENT_SUBTASK(state: any, task: ISubTask) {
            state.current.subTasks.push(task);
        },

        DELETE_CURRENT_SUBTASK(state: any, id: string) {
            const i = state.current.subTasks.findIndex((e: ISubTask) => {
                return e.id === id;
            });

            if (i >= 0) {
                state.current.subTasks.splice(i, 1);
            }
        },

        UPDATE_CURRENT_SUBTASK_NAME(state: any, subTask: any) {
            const i = state.current.subTasks.findIndex((e: ISubTask) => {
                return e.id === subTask.id;
            });

            if (i >= 0) {
                state.current.subTasks[i].name = subTask.name;
            }
        },
    },

    actions: {
        updateCounter: (context: any) => {
            context.commit('INCREASE_ID_COUNTER');
        },

        addTask: (context: any, task: ITaskDaily) => {
            context.commit('ADD_TASK', task);
        },

        updateTask: (context: any, task: ITaskDaily) => {
            context.commit('UPDATE_TASK', task);
        },

        completeTask: (context: any, id: string) => {
            context.commit('COMPLETE_TASK', id);
        },

        moveTaskUp: (context: any, id: string) => {
            context.commit('MOVE_TASK_UP', id);
        },

        moveTaskDown: (context: any, id: string) => {
            context.commit('MOVE_TASK_DOWN', id);
        },

        updateCheck: (context: any, payload: any) => {
            context.commit('UPDATE_SUBTASK_CHECK', payload);
        },

        updateCurrent: (context: any, task: ITaskDaily) => {
            context.commit('UPDATE_CURRENT_TASK', task);
        },

        addCurrentSubTask: (context: any, task: ISubTask) => {
            context.commit('ADD_CURRENT_SUBTASK', task);
        },

        deleteCurrentSubTask: (context: any, id: string) => {
            context.commit('DELETE_CURRENT_SUBTASK', id);
        },

        updateCurrentSubTaskName: (context: any, subTask: any) => {
            context.commit('UPDATE_CURRENT_SUBTASK_NAME', subTask);
        },
    },
};
