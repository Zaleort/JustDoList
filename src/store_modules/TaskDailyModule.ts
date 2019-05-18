import Vue from 'vue';
import '../interfaces/ITaskDaily';
import firebase from 'firebase/app';
import 'firebase/database';

/*
    Módulo de las Tareas Diarias. Aquí se almacenará en un array las tareas disponibles
    y contendrá las mutaciones para las operaciones CRUD.

    Dentro de las acciones se hacen llamadas AJAX para actualizar los datos en la BD
*/

export default {
    namespaced: true,
    state: {
        tasks: {} as ITasksDaily,
        current: {
            name: '',
            notes: '',
            subTasks: {},
            tags: {},
            frecuency: 'd1',
            streak: 0,
            completed: false,
            dateCreated: null,
            dateUpdated: null,
            dateCompleted: null,
            dateLastCompleted: null,
        } as ITaskDaily,
        currentId: '',
    },

    mutations: {
        SET_TASKS(state: any, tasks: ITasksDaily) {
            state.tasks = tasks;
        },

        ADD_TASK(state: any, {id, task}: ITaskDailyId) {
            Vue.set(state.tasks, id, task);
        },

        UPDATE_TASK(state: any, {id, task}: ITaskDailyId) {
            Vue.set(state.tasks, id, task);
        },

        DELETE_TASK(state: any, id: string) {
            Vue.delete(state.tasks, id);
        },

        COMPLETE_TASK(state: any, id: string) {
            const task = state.tasks[id];

            if (!task) { return; }

            if (task.completed) {
                task.dateCompleted = task.dateLastCompleted;
                task.completed = false;
                task.streak--;
            } else {
                task.dateCompleted = new Date();
                task.completed = true;
                task.streak++;
            }
        },

        RESET_STREAK(state: any, id: string) {
            const task = state.tasks[id];

            if (task) {
                task.streak = 0;
            }
        },

        REFRESH_TASK(state: any, id: string) {
            const task = state.tasks[id];

            if (task) {
                task.completed = false;
                task.dateLastCompleted = task.dateCompleted;
            }
        },

        MOVE_TASK_UP(state: any, id: string) {
            if (!state.tasks || state.tasks.length === 0) { return; }

            const i = state.tasks.findIndex((e: ITaskDaily) => {
                return e.id === id;
            });

            if ((i - 1) < 0) { return; }

            state.tasks.splice(i - 1, 0, state.tasks.splice(i, 1)[0]);
        },

        MOVE_TASK_DOWN(state: any, id: string) {
            if (!state.tasks || state.tasks.length === 0) { return; }

            const i = state.tasks.findIndex((e: ITaskDaily) => {
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

        SET_CURRENT_ID(state: any, id: string) {
            state.currentId = id;
        },

        RESET_CURRENT_TASK(state: any) {
            state.current = {
                name: '',
                notes: '',
                subTasks: {},
                tags: {},
                frecuency: 'd1',
                streak: 0,
                completed: false,
                dateCreated: null,
                dateUpdated: null,
                dateCompleted: null,
                dateLastCompleted: null,
            } as ITaskDaily;

            state.currentId = '';
        },

        UPDATE_CURRENT_TASK(state: any, id: string) {
            const task = state.tasks[id];

            if (task) {
                state.current = JSON.parse(JSON.stringify(task));
            }
        },

        SET_CURRENT_FRECUENCY_NUMBER(state: any, fNumber: string) {
            const type = state.current.frecuency.charAt(0);
            state.current.frecuency = type + fNumber;
        },

        SET_CURRENT_FRECUENCY_TYPE({ current }: any, type: string) {
            const fNumber = current.frecuency.substring(1, current.frecuency.length);
            current.frecuency = type + fNumber;
        },

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

        // Borra las etiquetas que ya no existan en el módulo tag
        CLEAN_TAGS(state: any, id: string) {
            for (const key in state.tasks) {
                if (state.tasks[key].tags != null) {
                    Vue.delete(state.tasks[key].tags, id);
                }
            }
        },
    },

    actions: {
        addTask: (context: any, task: ITaskDaily) => {
            const id = firebase.database().ref('daily').push().key;
            task.dateCreated = new Date();
            console.log(task);
            context.commit('ADD_TASK', {id, task});
            firebase.database().ref('daily/' + id).set(task);
        },

        updateTask: (context: any, {id, task}: ITaskDailyId) => {
            task.dateUpdated = new Date();
            console.log(task);
            context.commit('UPDATE_TASK', {id, task});
            firebase.database().ref('daily/' + id).set(task);
        },

        deleteTask: (context: any, id: string) => {
            context.commit('DELETE_TASK', id);
            firebase.database().ref('daily/' + id).remove();
        },

        completeTask: (context: any, id: string) => {
            context.commit('COMPLETE_TASK', id);
            firebase.database().ref('daily/' + id).set(context.state.tasks[id]);
        },

        resetStreak: (context: any, id: string) => {
            context.commit('RESET_STREAK', id);
            firebase.database().ref('daily/' + id).update({ streak: 0 });
        },

        refreshTask: (context: any, id: string) => {
            context.commit('REFRESH_TASK', id);
            firebase.database().ref('daily/' + id).set(context.state.tasks[id]);
        },

        moveTaskUp: (context: any, id: string) => {
            context.commit('MOVE_TASK_UP', id);
        },

        moveTaskDown: (context: any, id: string) => {
            context.commit('MOVE_TASK_DOWN', id);
        },

        updateCheck: (context: any, {id, taskId, checked}: any) => {
            context.commit('UPDATE_SUBTASK_CHECK', {id, taskId, checked});
            firebase.database().ref('daily/' + taskId + '/subTasks/' + id).update({checked});
        },

        updateCurrent: (context: any, id: string) => {
            context.commit('UPDATE_CURRENT_TASK', id);
            context.commit('SET_CURRENT_ID', id);
        },

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
