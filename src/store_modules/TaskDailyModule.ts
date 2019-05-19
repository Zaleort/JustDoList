import Vue from 'vue';
import { Module, MutationTree, ActionTree } from 'vuex';
import '../interfaces/ITaskDaily';
import firebase from 'firebase/app';
import 'firebase/database';

/*
    Módulo de las Tareas Diarias. Aquí se almacenará en un array las tareas disponibles
    y contendrá las mutaciones para las operaciones CRUD.

    Dentro de las acciones se hacen llamadas AJAX para actualizar los datos en la BD
*/

const namespaced: boolean = true;
const dailyState: DailyState = {
    tasks: {},
    current: {
        name: '',
        notes: '',
        subTasks: {},
        tags: {},
        frecuency: 'd1',
        streak: 0,
        completed: false,
        dateCreated: 0,
        dateUpdated: 0,
        dateCompleted: 0,
        dateLastCompleted: 0,
    },
    currentId: '',
};

const mutations: MutationTree<DailyState> = {
    SET_TASKS(state, tasks: ITasksDaily) {
        state.tasks = tasks;
    },

    ADD_TASK(state, {id, task}: ITaskDailyId) {
        Vue.set(state.tasks, id, task);
    },

    UPDATE_TASK(state, {id, task}: ITaskDailyId) {
        Vue.set(state.tasks, id, task);
    },

    DELETE_TASK(state, id: string) {
        Vue.delete(state.tasks, id);
    },

    COMPLETE_TASK(state, id: string) {
        const task = state.tasks[id];

        if (task == null) { return; }

        if (task.completed) {
            task.dateCompleted = task.dateLastCompleted;
            task.completed = false;
            task.streak--;
        } else {
            task.dateCompleted = new Date().getTime();
            task.completed = true;
            task.streak++;
        }
    },

    RESET_STREAK(state, id: string) {
        const task = state.tasks[id];

        if (task) {
            task.streak = 0;
        }
    },

    REFRESH_TASK(state, id: string) {
        const task = state.tasks[id];

        if (task) {
            task.completed = false;
            task.dateLastCompleted = task.dateCompleted;
        }
    },

    UPDATE_SUBTASK_CHECK(state, {id, taskId, checked}: any) {
        const subTask = state.tasks[taskId].subTasks![id];

        if (subTask != null) {
            subTask.checked = checked;
        }
    },

    SET_CURRENT_ID(state, id: string) {
        state.currentId = id;
    },

    RESET_CURRENT_TASK(state) {
        state.current = {
            name: '',
            notes: '',
            subTasks: {},
            tags: {},
            frecuency: 'd1',
            streak: 0,
            completed: false,
            dateCreated: 0,
            dateUpdated: 0,
            dateCompleted: 0,
            dateLastCompleted: 0,
        } as ITaskDaily;

        state.currentId = '';
    },

    UPDATE_CURRENT_TASK(state, id: string) {
        const task = state.tasks[id];

        if (task) {
            state.current = JSON.parse(JSON.stringify(task));
        }
    },

    SET_CURRENT_FRECUENCY_NUMBER(state, fNumber: string) {
        if (state.current.frecuency == null) {
            state.current.frecuency = 'd1';
        }

        const type = state.current.frecuency.charAt(0);
        state.current.frecuency = type + fNumber;
    },

    SET_CURRENT_FRECUENCY_TYPE({ current }, type: string) {
        if (current.frecuency == null) {
            current.frecuency = 'd1';
        }

        const fNumber = current.frecuency.substring(1, current.frecuency.length);
        current.frecuency = type + fNumber;
    },

    ADD_CURRENT_SUBTASK(state, {id, subTask}: ISubTaskId) {
        if (state.current.subTasks == null) {
            state.current.subTasks = {};
        }

        Vue.set(state.current.subTasks, id, subTask);
    },

    DELETE_CURRENT_SUBTASK(state, id: string) {
        if (state.current.subTasks != null) {
            Vue.delete(state.current.subTasks, id);
        }
    },

    UPDATE_CURRENT_SUBTASK_NAME(state, {id, name}) {
        if (state.current.subTasks == null) { return; }
        const subTask = state.current.subTasks[id];

        if (subTask != null) {
            subTask.name = name;
            Vue.set(subTask, id, subTask);
        }
    },

    // Tags of Current Task
    ADD_CURRENT_TAG(state, tagId: string) {
        if (state.current.tags == null) {
            state.current.tags = {};
        }

        Vue.set(state.current.tags, tagId, true);
    },

    DELETE_CURRENT_TAG(state, tagId: string) {
        if (state.current.tags != null) {
            Vue.delete(state.current.tags, tagId);
        }
    },

    // Borra las etiquetas que ya no existan en el módulo tag
    CLEAN_TAGS(state, id: string) {
        for (const key in state.tasks) {
            if (state.tasks[key].tags != null) {
                Vue.delete(state.tasks[key].tags!, id);
            }
        }
    },
};

const actions: ActionTree<DailyState, any> = {
    addTask: (context, task: ITaskDaily) => {
        const id = firebase.database().ref('daily').push().key;
        task.dateCreated = new Date().getTime();
        context.commit('ADD_TASK', {id, task});
        firebase.database().ref('daily/' + id).set(task);
    },

    updateTask: (context, {id, task}: ITaskDailyId) => {
        task.dateUpdated = new Date().getTime();
        context.commit('UPDATE_TASK', {id, task});
        firebase.database().ref('daily/' + id).set(task);
    },

    deleteTask: (context, id: string) => {
        context.commit('DELETE_TASK', id);
        firebase.database().ref('daily/' + id).remove();
    },

    completeTask: (context, id: string) => {
        context.commit('COMPLETE_TASK', id);
        firebase.database().ref('daily/' + id).update(context.state.tasks[id]);
    },

    resetStreak: (context, id: string) => {
        context.commit('RESET_STREAK', id);
        firebase.database().ref('daily/' + id).update({ streak: 0 });
    },

    refreshTask: (context, id: string) => {
        context.commit('REFRESH_TASK', id);
        firebase.database().ref('daily/' + id).set(context.state.tasks[id]);
    },

    moveTaskUp: (context, id: string) => {
        context.commit('MOVE_TASK_UP', id);
    },

    moveTaskDown: (context, id: string) => {
        context.commit('MOVE_TASK_DOWN', id);
    },

    updateCheck: (context, {id, taskId, checked}) => {
        context.commit('UPDATE_SUBTASK_CHECK', {id, taskId, checked});
        firebase.database().ref('daily/' + taskId + '/subTasks/' + id).update({checked});
    },

    updateCurrent: (context, id: string) => {
        context.commit('UPDATE_CURRENT_TASK', id);
        context.commit('SET_CURRENT_ID', id);
    },

    addCurrentSubTask: (context, subTask: ISubTask) => {
        const id = firebase.database().ref().push().key;
        context.commit('ADD_CURRENT_SUBTASK', {id, subTask});
    },

    deleteCurrentSubTask: (context, id: string) => {
        context.commit('DELETE_CURRENT_SUBTASK', id);
    },

    updateCurrentSubTaskName: (context, subTask: ISubTask) => {
        context.commit('UPDATE_CURRENT_SUBTASK_NAME', subTask);
    },

    // Tags of Current Task
    addCurrentTag: (context, tagId: string) => {
        context.commit('ADD_CURRENT_TAG', tagId);
    },

    deleteCurrentTag: (context, tagId: string) => {
        context.commit('DELETE_CURRENT_TAG', tagId);
    },
};

const dailyModule: Module<DailyState, any> = {
    namespaced,
    state: dailyState,
    mutations,
    actions,
};

export default dailyModule;
