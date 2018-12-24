import Vue from 'vue';
import Vuex from 'vuex';
import TaskPendingModule from './store_modules/TaskPendingModule';
import TaskDailyModule from './store_modules/TaskDailyModule';

Vue.use(Vuex);

export default new Vuex.Store({
    strict: true,
    modules: {
        daily: TaskDailyModule,
        pending: TaskPendingModule,
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

        closeDialog: (context: any, dialog: string) => {
            const e = document.getElementById(dialog);

            if (e) {
                e.classList.remove('show');
            }
        },

        openDialog: (context: any, dialog: string) => {
            const e = document.getElementById(dialog);

            if (e) {
                e.classList.add('show');
            }
        },
    },
});
