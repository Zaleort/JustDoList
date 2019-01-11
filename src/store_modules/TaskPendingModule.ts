import '../interfaces/ITaskPending';
import Vue from 'vue';

/*
    Módulo de las Tareas Pendientes. Aquí se almacenará en un array las tareas disponibles
    y contendrá las mutaciones para las operaciones CRUD.

    Dentro de las acciones se hacen llamadas AJAX para actualizar los datos en la BD
*/

export default {
    namespaced: true,
    state: {
        tasks: [] as ITaskPending[],
        idCounter: '0',

        // Al hacer click en editar tarea, se poblará este objeto para mostrar sus datos
        // correctamente en el formulario de edición
        current: {
            id: '',
            name: '',
            notes: '',
            subTasks: [],
        } as ITaskPending,
    },

    mutations: {
        UPDATE_ID_COUNTER(state: any) {
            let id = state.idCounter;
            id++;
            state.idCounter = id.toString();
        },

        ADD_TASK(state: any, task: ITaskPending) {
            state.tasks.push(task);
        },

        UPDATE_TASK(state: any, task: ITaskPending) {
            const i = state.tasks.findIndex((e: ITaskPending) => {
                return e.id === task.id;
            });

            if (i >= 0) {
                Vue.set(state.tasks, i, task);
            }
        },

        COMPLETE_TASK(state: any, id: string) {
            const i = state.tasks.findIndex((e: ITaskPending) => {
                return e.id === id;
            });

            state.tasks.splice(i, 1);
        },

        UPDATE_SUBTASK_CHECK(state: any, payload: any) {
            const i = state.tasks.findIndex((e: ITaskPending) => {
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

        UPDATE_CURRENT_TASK(state: any, task: ITaskPending) {
            state.current = task;
        },

        ADD_CURRENT_SUBTASK(state: any, task: ISubTask) {
            state.current.subTasks.push(task);
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
            context.commit('UPDATE_ID_COUNTER');
        },

        addTask: (context: any, task: ITaskPending) => {
            context.commit('ADD_TASK', task);
        },

        updateTask: (context: any, task: ITaskPending) => {
            context.commit('UPDATE_TASK', task);
        },

        completeTask: (context: any, id: string) => {
            context.commit('COMPLETE_TASK', id);
        },

        updateCheck: (context: any, payload: any) => {
            context.commit('UPDATE_SUBTASK_CHECK', payload);
        },

        updateCurrent: (context: any, task: ITaskPending) => {
            context.commit('UPDATE_CURRENT_TASK', task);
        },

        addCurrentSubTask: (context: any, task: ISubTask) => {
            context.commit('ADD_CURRENT_SUBTASK', task);
        },

        updateCurrentSubTaskName: (context: any, subTask: any) => {
            context.commit('UPDATE_CURRENT_SUBTASK_NAME', subTask);
        },
    },
};
