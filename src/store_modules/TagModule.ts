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
                id: '0',
                name: 'Trabajo',
                color: '#ff0000',
            },
        ] as ITag[],

        idCounter: '0',
    },

    mutations: {
        INCREASE_ID_COUNTER(state: any) {
            let id = state.idCounter;
            id++;
            state.idCounter = id.toString();
        },

        ADD_TAG(state: any, tag: ITag) {
            state.tags.push(tag);
        },

        UPDATE_TAG(state: any, tag: ITag) {
            const i = state.tags.findIndex((t: ITag) => {
                return t.id === tag.id;
            });

            if (i >= 0) {
                Vue.set(state.tags, i, tag);
            }
        },

        DELETE_TAG(state: any, id: string) {
            const i = state.tags.findIndex((t: ITag) => {
                return t.id === id;
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
            context.commit('pending/CLEAN_TAGS', id, { root: true });
            context.commit('daily/CLEAN_TAGS', id, { root: true });
        },
    },
};
