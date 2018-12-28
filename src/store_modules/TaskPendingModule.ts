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
        add(state: any, task: ITaskPending) {
            state.tasks.push(task);
        },

        update(state: any, task: ITaskPending) {
            const i = state.tasks.findIndex((e: ITaskPending) => {
                return e.id === task.id;
            });

            if (i >= 0) {
                Vue.set(state.tasks, i, task);
            }
        },

        complete(state: any, id: string) {
            const i = state.tasks.findIndex((e: ITaskPending) => {
                return e.id === id;
            });

            state.tasks.splice(i, 1);
        },

        updateCheck: (state: any, payload: any) => {
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

        updateCurrent(state: any, task: ITaskPending) {
            state.current = task;
        },

        addCurrentSubTask(state: any, task: ISubTask) {
            state.current.subTasks.push(task);
        },

        updateCurrentSubTaskName(state: any, subTask: any) {
            const i = state.current.subTasks.findIndex((e: ISubTask) => {
                return e.id === subTask.id;
            });

            if (i >= 0) {
                state.current.subTasks[i].name = subTask.name;
            }
        },
    },

    actions: {
        addTask: (context: any, task: ITaskPending) => {
            context.commit('add', task);
        },

        updateTask: (context: any, task: ITaskPending) => {
            context.commit('update', task);
        },

        completeTask: (context: any, id: string) => {
            context.commit('complete', id);
        },

        updateCheck: (context: any, payload: any) => {
            context.commit('updateCheck', payload);
        },

        updateCurrent: (context: any, task: ITaskPending) => {
            context.commit('updateCurrent', task);
        },

        addCurrentSubTask: (context: any, task: ISubTask) => {
            context.commit('addCurrentSubTask', task);
        },

        updateCurrentSubTaskName: (context: any, subTask: any) => {
            context.commit('updateCurrentSubTaskName', subTask);
        },
    },
};
