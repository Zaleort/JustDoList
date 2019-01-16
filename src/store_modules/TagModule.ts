import Vue from 'vue';
import '../interfaces/ITag';

/*
    Módulo de las etiquetas. Aquí se almacenará un array con las etiquetas del usuario
    y todos los métodos necesarios para gestionar las etiquetas.
*/

export default {
    namespaced: true,
    state: {
        tags: [
            {
                name: 'Trabajo',
                color: '#ff0000',
            },
        ] as ITag[],
    },

    mutations: {
        ADD_TAG(state: any, tag: ITag) {
            state.tags.push(tag);
        },

        UPDATE_TAG(state: any, tag: ITag) {
            const i = state.tags.findIndex((t: ITag) => {
                return t.name === tag.name;
            });

            if (i >= 0) {
                Vue.set(state.tasks, i, tag);
            }
        },

        DELETE_TAG(state: any, name: string) {
            const i = state.tags.findIndex((t: ITag) => {
                return t.name === name;
            });

            if (i >= 0) {
                state.tags.splice(i, 1);
            }
        },
    },

    actions: {
        addTag: (context: any, tag: ITag) => {
            context.commit('ADD_TAG', tag);
        },

        updateTag: (context: any, tag: ITag) => {
            context.commit('UPDATE_TAG', tag);
        },

        deleteTag: (context: any, id: string) => {
            context.commit('DELETE_TAG', id);
        },
    },
};
