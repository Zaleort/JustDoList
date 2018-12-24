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

        updateCurrent(state: any, task: ITaskPending) {
            state.current = task;
        },

        addCurrentSubTask(state: any, task: ISubTask) {
            state.current.subTasks.push(task);
        },
    },

    actions: {
        addTask: (context: any, task: ITaskPending) => {
            context.commit('add', task);
        },

        updateTask: (context: any, task: ITaskPending) => {
            context.commit('update', task);
        },

        updateCurrent: (context: any, task: ITaskPending) => {
            context.commit('updateCurrent', task);
        },

        addCurrentSubTask: (context: any, task: ISubTask) => {
            context.commit('addCurrentSubTask', task);
        },
    },
};
