export default {
    namespaced: true,
    state: {
        tareas: [ {id: 1, titulo: 'Tarea 1'} ],
    },

    mutations: {
        add(state: any, tarea: object) {
            state.tareas.push(tarea);
        },
    },

    actions: {
        addTarea: (context: any, tarea: object) => {
            context.commit('add', tarea);
        },
    },
};
