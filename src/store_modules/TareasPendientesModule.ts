import '../interfaces/ITareaPendiente';
import Vue from 'vue';

export default {
    namespaced: true,
    state: {
        tareas: [ {id: '1', titulo: 'Tarea 1', hasSubTareas: true,
            subTareas: [{ id: 1, titulo: 'Sub Tarea 1', checked: true } ],
        } ] as ITareaPendiente[],
    },

    mutations: {
        add(state: any, tarea: ITareaPendiente) {
            state.tareas.push(tarea);
        },

        update(state: any, tarea: ITareaPendiente) {
            const i = state.tareas.findIndex((e: ITareaPendiente) => {
                return e.id === tarea.id;
            });

            if (i >= 0) {
                Vue.set(state.tareas, i, tarea);
            }
        },
    },

    actions: {
        addTarea: (context: any, tarea: ITareaPendiente) => {
            context.commit('add', tarea);
        },

        updateTarea: (context: any, tarea: ITareaPendiente) => {
            context.commit('update', tarea);
        },
    },
};
