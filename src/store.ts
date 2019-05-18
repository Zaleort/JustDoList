import Vue from 'vue';
import Vuex from 'vuex';
import TaskPendingModule from './store_modules/TaskPendingModule';
import TaskDailyModule from './store_modules/TaskDailyModule';
import TagModule from './store_modules/TagModule';
import firebase from 'firebase/app';
import 'firebase/database';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        daily: TaskDailyModule,
        pending: TaskPendingModule,
        tag: TagModule,
    },

    state: {

    },

    mutations: {

    },

    actions: {
        toggleNav: () => {
            const navMenu: any = document.getElementById('nav-menu');
            navMenu.classList.toggle('nav-menu-show');
        },

        closeNav: () => {
            const navMenu: any = document.getElementById('nav-menu');
            navMenu.classList.remove('nav-menu-show');
        },

        setStateFromDatabase: (context: any) => {
            firebase.database().ref('tags').once('value')
                .then((snapshot) => {
                    if (snapshot.exists()) {
                        context.commit('tag/SET_TAGS', snapshot.val());
                    }
                });

            firebase.database().ref('pending').once('value')
                .then((snapshot) => {
                    if (snapshot.exists()) {
                        context.commit('pending/SET_TASKS', snapshot.val());
                    }
                });

            firebase.database().ref('daily').once('value')
                .then((snapshot) => {
                    if (snapshot.exists()) {
                        context.commit('daily/SET_TASKS', snapshot.exportVal());
                    }
                });
        },
    },
});
