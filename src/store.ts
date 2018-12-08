import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const tareasDiarias = {
    namespaced: true,
    state: {
        tareas: [ {id: 1, titulo: 'Tarea 1'} ],
    },

    mutations: {
        add(state: any, tarea: object) {
            state.tareas.push(tarea);
        },
    },

    actions: {
        addTarea: (context: any, tarea: object) => {
            context.commit('add', tarea);
        },
    },
};

const tareasPendientes = {
    namespaced: true,
    state: {
        tareas: [ {id: 1, titulo: 'Tarea 1', hasSubTareas: true,
            subTareas: [{ id: 1, titulo: 'Sub Tarea 1', checked: true } ],
        } ],
    },

    mutations: {
        add(state: any, tarea: object) {
            state.tareas.push(tarea);
        },
    },

    actions: {
        addTarea: (context: any, tarea: object) => {
            context.commit('add', tarea);
        },
    },
};

export default new Vuex.Store({
    modules: {
        diarias: tareasDiarias,
        pendientes: tareasPendientes,
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
