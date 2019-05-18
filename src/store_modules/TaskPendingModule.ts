import '../interfaces/ITaskPending';
import Vue from 'vue';
import firebase from 'firebase/app';
import 'firebase/database';

/*
    Módulo de las Tareas Pendientes. Aquí se almacenará en un array las tareas disponibles
    y contendrá las mutaciones para las operaciones CRUD.

    Dentro de las acciones se hacen llamadas AJAX para actualizar los datos en la BD
*/

export default {
    namespaced: true,
    state: {
        tasks: {} as ITasksPending,

        // Al hacer click en editar tarea, se poblará este objeto para mostrar sus datos
        // correctamente en el formulario de edición
        current: {
            name: '',
            notes: '',
            subTasks: {},
            subTaskId: 0,
            tags: {},
        } as ITaskPending,

        currentId: '',
    },

    mutations: {
        // Tasks
        SET_TASKS(state: any, tasks: ITasksPending) {
            state.tasks = tasks;
        },

        ADD_TASK(state: any, {id, task}: ITaskPendingId) {
            Vue.set(state.tasks, id, task);
        },

        UPDATE_TASK(state: any, {id, task}: ITaskPendingId) {
            Vue.set(state.tasks, id, task);
        },

        DELETE_TASK(state: any, id: string) {
            Vue.delete(state.tasks, id);
        },

        COMPLETE_TASK(state: any, id: string) {
            Vue.delete(state.tasks, id);
        },

        MOVE_TASK_UP(state: any, id: string) {
            if (!state.tasks || state.tasks.length === 0) { return; }

            const i = state.tasks.findIndex((e: ITaskPending) => {
                return e.id === id;
            });

            if ((i - 1) < 0) { return; }

            state.tasks.splice(i - 1, 0, state.tasks.splice(i, 1)[0]);
        },

        MOVE_TASK_DOWN(state: any, id: string) {
            if (!state.tasks || state.tasks.length === 0) { return; }

            const i = state.tasks.findIndex((e: ITaskPending) => {
                return e.id === id;
            });

            if ((i + 1) >= state.tasks.length) { return; }

            state.tasks.splice(i + 1, 0, state.tasks.splice(i, 1)[0]);
        },

        UPDATE_SUBTASK_CHECK(state: any, {id, taskId, checked}: any) {
            const task = state.tasks[taskId];

            if (task) {
                const sub = task.subTasks[id];

                if (sub) {
                    state.tasks[taskId].subTasks[id].checked = checked;
                }
            }
        },

        // Current Task
        SET_CURRENT_ID(state: any, id: string) {
            state.currentId = id;
        },

        RESET_CURRENT_TASK(state: any) {
            state.current = {
                name: '',
                notes: '',
                subTasks: {},
                tags: {},
                completed: false,
                dateCreated: null,
                dateUpdated: null,
                dateCompleted: null,
            } as ITaskPending;

            state.currentId = '';
        },

        UPDATE_CURRENT_TASK(state: any, id: string) {
            const task = state.tasks[id];

            if (task) {
                state.current = JSON.parse(JSON.stringify(task));
            }
        },

        // Subtasks of Current Task
        ADD_CURRENT_SUBTASK(state: any, {id, subTask}: ISubTaskId) {
            if (state.current.subTasks == null) {
                state.current.subTasks = {};
            }

            Vue.set(state.current.subTasks, id, subTask);
        },

        DELETE_CURRENT_SUBTASK(state: any, id: string) {
            Vue.delete(state.current.subTasks, id);
        },

        UPDATE_CURRENT_SUBTASK_NAME(state: any, {id, name}: any) {
            const subTask = state.current.subTasks[id];

            if (subTask != null) {
                subTask.name = name;
                Vue.set(state.current.subTasks, id, subTask);
            }
        },

        // Tags of Current Task
        ADD_CURRENT_TAG(state: any, tagId: string) {
            if (state.current.tags == null) {
                state.current.tags = {};
            }

            Vue.set(state.current.tags, tagId, true);
        },

        DELETE_CURRENT_TAG(state: any, tagId: string) {
            Vue.delete(state.current.tags, tagId);
        },

        // Tags
        CLEAN_TAGS(state: any, id: string) {
            for (const key in state.tasks) {
                if (state.tasks[key].tags != null) {
                    Vue.delete(state.tasks[key].tags, id);
                }
            }
        },
    },

    actions: {
        // Tasks
        addTask: (context: any, task: ITaskDaily) => {
            const id = firebase.database().ref('pending').push().key;
            task.dateCreated = new Date();
            context.commit('ADD_TASK', {id, task});
            firebase.database().ref('daily/' + id).set(task);
        },

        updateTask: (context: any, {id, task}: ITaskDailyId) => {
            task.dateUpdated = new Date();
            context.commit('UPDATE_TASK', {id, task});
            firebase.database().ref('pending/' + id).set(task);
        },

        deleteTask: (context: any, id: string) => {
            context.commit('DELETE_TASK', id);
            firebase.database().ref('pending/' + id).remove();
        },

        completeTask: (context: any, id: string) => {
            context.commit('COMPLETE_TASK', id);
        },

        moveTaskUp: (context: any, id: string) => {
            context.commit('MOVE_TASK_UP', id);
        },

        moveTaskDown: (context: any, id: string) => {
            context.commit('MOVE_TASK_DOWN', id);
        },

        updateCheck: (context: any, {id, taskId, checked}: any) => {
            context.commit('UPDATE_SUBTASK_CHECK', {id, taskId, checked});
            firebase.database().ref('pending/' + taskId + '/subTasks/' + id).update({checked});
        },

        // Current Task
        updateCurrent: (context: any, id: string) => {
            context.commit('UPDATE_CURRENT_TASK', id);
            context.commit('SET_CURRENT_ID', id);
        },

        // SubTasks of Current Task
        addCurrentSubTask: (context: any, subTask: ISubTask) => {
            const id = firebase.database().ref().push().key;
            context.commit('ADD_CURRENT_SUBTASK', {id, subTask});
        },

        deleteCurrentSubTask: (context: any, id: string) => {
            context.commit('DELETE_CURRENT_SUBTASK', id);
        },

        updateCurrentSubTaskName: (context: any, subTask: ISubTask) => {
            context.commit('UPDATE_CURRENT_SUBTASK_NAME', subTask);
        },

        // Tags of Current Task
        addCurrentTag: (context: any, tagId: string) => {
            context.commit('ADD_CURRENT_TAG', tagId);
        },

        deleteCurrentTag: (context: any, tagId: string) => {
            context.commit('DELETE_CURRENT_TAG', tagId);
        },
    },
};
