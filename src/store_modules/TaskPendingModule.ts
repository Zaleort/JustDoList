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
        tasks: [
            {
                id: '1',
                name: 'Tarea 1',
                subTasks: [
                    {
                        id: '1',
                        name: 'SubTarea 1',
                        checked: true,
                    },
                ],
            },
        ] as ITaskPending[],
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
    },

    actions: {
        addTask: (context: any, task: ITaskPending) => {
            context.commit('add', task);
        },

        updateTask: (context: any, task: ITaskPending) => {
            context.commit('update', task);
        },
    },
};
