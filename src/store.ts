import Vue from 'vue';
import Vuex from 'vuex';
import TaskPendingModule from './store_modules/TaskPendingModule';
import TaskDailyModule from './store_modules/TaskDailyModule';
import TagModule from './store_modules/TagModule';

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
    },
});
