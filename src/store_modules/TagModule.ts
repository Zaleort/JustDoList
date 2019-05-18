import Vue from 'vue';
import '../interfaces/ITag';
import firebase from 'firebase/app';
import 'firebase/database';

/*
    Módulo de las etiquetas. Aquí se almacenará un array con las etiquetas del usuario
    y todos los métodos necesarios para gestionar las etiquetas.
*/

export default {
    namespaced: true,
    state: {
        tags: {
            kgjdkg: {
                name: 'Trabajo',
                color: '#000000',
            },
        } as ITags,
    },

    mutations: {
        SET_TAGS(state: any, tags: ITags) {
            state.tags = tags;
        },

        INCREASE_ID_COUNTER(state: any) {
            let id = state.idCounter;
            id++;
            state.idCounter = id.toString();
        },

        ADD_TAG(state: any, {id, tag}: any) {
            Vue.set(state.tags, id, tag);
        },

        UPDATE_TAG(state: any, {id, tag}: any) {
            Vue.set(state.tags, id, tag);
        },

        DELETE_TAG(state: any, id: string) {
            Vue.delete(state.tags, id);
        },
    },

    actions: {
        addTag: (context: any, tag: ITag) => {
            return new Promise((resolve) => {
                const id = firebase.database().ref('tags').push().key;
                context.commit('ADD_TAG', {id, tag});
                firebase.database().ref('tags/' + id).set(tag);

                resolve({ id });
            });
        },

        updateTag: (context: any, {id, tag}: any) => {
            context.commit('UPDATE_TAG', {id, tag});
            firebase.database().ref('tags/' + id).set(tag);
        },

        deleteTag: (context: any, id: string) => {
            context.commit('DELETE_TAG', id);
            context.commit('pending/CLEAN_TAGS', id, { root: true });
            context.commit('daily/CLEAN_TAGS', id, { root: true });

            firebase.database().ref('tags/' + id).remove();
        },
    },
};
