import '../interfaces/ITaskPending';
import Vue from 'vue';
import firebase from 'firebase/app';
import 'firebase/database';
import { MutationTree, ActionTree, Module } from 'vuex';

/*
    Módulo de las Tareas Pendientes. Aquí se almacenará en un array las tareas disponibles
    y contendrá las mutaciones para las operaciones CRUD.

    Dentro de las acciones se hacen llamadas AJAX para actualizar los datos en la BD
*/

const namespaced: boolean = true;
const pendingState: PendingState = {
    tasks: {},
    completed: {},

    // Al hacer click en editar tarea, se poblará este objeto para mostrar sus datos
    // correctamente en el formulario de edición
    current: {
        name: '',
        notes: '',
        subTasks: {},
        tags: {},
        completed: false,
        dateCreated: 0,
        dateUpdated: 0,
        dateCompleted: 0,
        dateDeadline: 0,
    },

    currentId: '',
};

const mutations: MutationTree<PendingState> = {
    // Tasks
    SET_TASKS(state, tasks: ITasksPending) {
        state.tasks = tasks;
    },

    SET_COMPLETED(state, completed: ITasksPending) {
        state.completed = completed;
    },

    ADD_TASK(state, {id, task}: ITaskPendingId) {
        Vue.set(state.tasks, id, task);
    },

    UPDATE_TASK(state, {id, task}: ITaskPendingId) {
        Vue.set(state.tasks, id, task);
    },

    DELETE_TASK(state, id: string) {
        Vue.delete(state.tasks, id);
    },

    COMPLETE_TASK(state, id: string) {
        state.tasks[id].completed = true;
        state.tasks[id].dateCompleted = new Date().getTime();
        Vue.set(state.completed, id, state.tasks[id]);
        Vue.delete(state.tasks, id);
    },

    UPDATE_SUBTASK_CHECK(state, {id, taskId, checked}: any) {
        const subTask = state.tasks[taskId].subTasks![id];

        if (subTask != null) {
            subTask.checked = checked;
        }
    },

    // Current Task
    SET_CURRENT_ID(state, id: string) {
        state.currentId = id;
    },

    RESET_CURRENT_TASK(state) {
        state.current = {
            name: '',
            notes: '',
            subTasks: {},
            tags: {},
            completed: false,
            dateCreated: 0,
            dateUpdated: 0,
            dateCompleted: 0,
            dateDeadline: 0,
        };

        state.currentId = '';
    },

    UPDATE_CURRENT_TASK(state, id: string) {
        const task = state.tasks[id];

        if (task) {
            state.current = JSON.parse(JSON.stringify(task));
        }
    },

    // Subtasks of Current Task
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
        const subTask = state.current.subTasks![id];

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

    // Tags
    CLEAN_TAGS(state, id: string) {
        for (const key in state.tasks) {
            if (state.tasks[key].tags != null) {
                Vue.delete(state.tasks[key].tags!, id);
            }
        }
    },

    // Completed Tasks
    UNDO_COMPLETE(state, id: string) {
        if (state.completed[id] == null) { return; }
        state.tasks[id] = state.completed[id];
        state.tasks[id].completed = false;
        Vue.delete(state.completed, id);
    },

    DELETE_COMPLETED_TASK(state, id: string) {
        if (state.completed[id] == null) { return; }
        Vue.delete(state.completed, id);
    },
};

const actions: ActionTree<PendingState, any> = {
    // Tasks
    addTask: (context, task: ITaskDaily) => {
        const id = firebase.database().ref('pending').push().key;
        task.dateCreated = new Date().getTime();
        context.commit('ADD_TASK', {id, task});
        firebase.database().ref('pending/' + id).set(task);
    },

    updateTask: (context, {id, task}: ITaskDailyId) => {
        task.dateUpdated = new Date().getTime();
        context.commit('UPDATE_TASK', {id, task});
        firebase.database().ref('pending/' + id).set(task);
    },

    deleteTask: (context, id: string) => {
        context.commit('DELETE_TASK', id);
        firebase.database().ref('pending/' + id).remove();
    },

    completeTask: (context, id: string) => {
        context.commit('COMPLETE_TASK', id);
        firebase.database().ref('pending/' + id).remove();
        firebase.database().ref('completed/' + id).set(context.state.completed[id]);
    },

    moveTaskUp: (context, id: string) => {
        context.commit('MOVE_TASK_UP', id);
    },

    moveTaskDown: (context, id: string) => {
        context.commit('MOVE_TASK_DOWN', id);
    },

    updateCheck: (context, {id, taskId, checked}) => {
        context.commit('UPDATE_SUBTASK_CHECK', {id, taskId, checked});
        firebase.database().ref('pending/' + taskId + '/subTasks/' + id).update({checked});
    },

    // Current Task
    updateCurrent: (context, id: string) => {
        context.commit('UPDATE_CURRENT_TASK', id);
        context.commit('SET_CURRENT_ID', id);
    },

    // SubTasks of Current Task
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

    // Completed tasks
    undoComplete: (context, id: string) => {
        context.commit('UNDO_COMPLETE', id);
        if (context.state.tasks[id] != null) {
            firebase.database().ref('pending/' + id).set(context.state.tasks[id]);
            firebase.database().ref('completed/' + id).remove();
        }
    },

    deleteCompletedTask: (context, id: string) => {
        context.commit('DELETE_COMPLETED_TASK', id);
        firebase.database().ref('completed/' + id).remove();
    },
};

const pendingMoule: Module<PendingState, any> = {
    namespaced,
    state: pendingState,
    mutations,
    actions,
};

export default pendingMoule;
