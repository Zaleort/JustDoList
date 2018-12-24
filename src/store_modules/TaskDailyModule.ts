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
    },

    mutations: {
        add(state: any, task: ITaskDaily) {
            state.tasks.push(task);
        },

        update(state: any, task: ITaskDaily) {
            const i = state.tasks.findIndex((e: ITaskDaily) => {
                return e.id === task.id;
            });

            if (i >= 0) {
                Vue.set(state.tasks, i, task);
            }
        },
    },

    actions: {
        addTask: (context: any, task: ITaskDaily) => {
            context.commit('add', task);
        },

        updateTask: (context: any, task: ITaskDaily) => {
            context.commit('update', task);
        },
    },
};
