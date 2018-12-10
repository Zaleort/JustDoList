import Vue from 'vue';
import Vuex from 'vuex';
import TareasPendientesModule from './store_modules/TareasPendientesModule';
import TareasDiariasModule from './store_modules/TareasDiariasModule';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        diarias: TareasDiariasModule,
        pendientes: TareasPendientesModule,
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
