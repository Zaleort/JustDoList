
/*
    Módulo de las Tareas Diarias. Aquí se almacenará en un array las tareas disponibles
    y contendrá las mutaciones para las operaciones CRUD.

    Dentro de las acciones se hacen llamadas AJAX para actualizar los datos en la BD
*/

export default {
    namespaced: true,
    state: {
        tasks: [ {id: 1, titulo: 'Tarea 1'} ],
    },

    mutations: {
        add(state: any, task: object) {
            state.tasks.push(task);
        },
    },

    actions: {
        addTask: (context: any, task: object) => {
            context.commit('add', task);
        },
    },
};
