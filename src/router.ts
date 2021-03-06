import Vue from 'vue';
import Router from 'vue-router';
import TasksView from './views/TasksView.vue';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            name: 'tareas',
            component: TasksView,
        },
        {
            path: '/completadas',
            name: 'completadas',
            // route level code-splitting
            // this generates a separate chunk (about.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import(/* webpackChunkName: "about" */ './views/Completed.vue'),
        },
    ],
});
