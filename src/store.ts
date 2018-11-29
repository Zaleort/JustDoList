import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
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
