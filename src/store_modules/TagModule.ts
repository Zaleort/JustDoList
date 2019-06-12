import Vue from 'vue';
import '../interfaces/ITag';
import firebase from 'firebase/app';
import 'firebase/database';
import { MutationTree, ActionTree, Module } from 'vuex';

/*
    Módulo de las etiquetas. Aquí se almacenará un array con las etiquetas del usuario
    y todos los métodos necesarios para gestionar las etiquetas.
*/

const namespaced: boolean = true;
const tagState: TagsState = {
    tags: {},
};

const mutations: MutationTree<TagsState> = {
    SET_TAGS: (state, tags: ITags) => {
        state.tags = tags;
    },

    ADD_TAG(state, {id, tag}) {
        Vue.set(state.tags, id, tag);
    },

    UPDATE_TAG(state, {id, tag}) {
        Vue.set(state.tags, id, tag);
    },

    DELETE_TAG(state, id) {
        Vue.delete(state.tags, id);
    },

    SET_COLOR(state, {id, color}) {
        if (state.tags[id] == null) { return; }
        state.tags[id].color = color;
    },
};

const actions: ActionTree<TagsState, any> = {
    addTag: (context, tag: ITag) => {
        return new Promise((resolve) => {
            const id = firebase.database().ref('tags').push().key;
            context.commit('ADD_TAG', {id, tag});
            firebase.database().ref('tags/' + id).set(tag);

            resolve({ id });
        });
    },

    updateTag: (context, {id, tag}) => {
        context.commit('UPDATE_TAG', {id, tag});
        firebase.database().ref('tags/' + id).set(tag);
    },

    deleteTag: (context, id) => {
        context.commit('DELETE_TAG', id);
        context.dispatch('pending/cleanTags', id, { root: true });
        context.dispatch('daily/cleanTags', id, { root: true });

        firebase.database().ref('tags/' + id).remove();
    },

    setColor: (context, {id, color}) => {
        context.commit('SET_COLOR', {id, color});
        firebase.database().ref('tags/' + id).update({color});
    },
};

const tagModule: Module<TagsState, any> = {
    namespaced,
    state: tagState,
    actions,
    mutations,
};

export default tagModule;
