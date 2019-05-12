import Vue from 'vue';
import '../interfaces/ITaskDaily';

/*
    Módulo de las Tareas Diarias. Aquí se almacenará en un array las tareas disponibles
    y contendrá las mutaciones para las operaciones CRUD.

    Dentro de las acciones se hacen llamadas AJAX para actualizar los datos en la BD
*/

export default {
    namespaced: true,
    state: {
        tasks: [] as ITaskDaily[],
        idCounter: '0',
        current: {
            id: '',
            name: '',
            notes: '',
            subTasks: [],
            subTaskId: 0,
            tags: [],
            frecuency: 'd1',
            streak: 0,
            completed: false,
        } as ITaskDaily,
    },

    mutations: {
        INCREASE_ID_COUNTER(state: any) {
            let id = state.idCounter;
            id++;
            state.idCounter = id.toString();
        },

        ADD_TASK(state: any, task: ITaskDaily) {
            state.tasks.push(task);
        },

        UPDATE_TASK(state: any, task: ITaskDaily) {
            const i = state.tasks.findIndex((e: ITaskDaily) => {
                return e.id === task.id;
            });

            if (i >= 0) {
                Vue.set(state.tasks, i, task);
            }
        },

        DELETE_TASK(state: any, id: string) {
            const i = state.tasks.findIndex((e: ITaskDaily) => {
                return e.id === id;
            });

            state.tasks.splice(i, 1);
        },

        COMPLETE_TASK(state: any, id: string) {
            const task = state.tasks.find((e: ITaskDaily) => {
                return e.id === id;
            });

            if (!task) { return; }
            if (task.completed) {
                task.completed = false;
                task.streak--;
            } else {
                task.completed = true;
                task.streak++;
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

        UPDATE_SUBTASK_CHECK(state: any, payload: any) {
            const i = state.tasks.findIndex((e: ITaskDaily) => {
                return e.id === payload.taskId;
            });

            if (i >= 0) {
                const j = state.tasks[i].subTasks.findIndex((e: ISubTask) => {
                    return e.id === payload.id;
                });

                if (j >= 0) {
                    state.tasks[i].subTasks[j].checked = payload.checked;
                }
            }
        },

        SET_CURRENT_ID(state: any) {
            state.current.id = state.idCounter;
        },

        RESET_CURRENT_TASK(state: any) {
            state.current = {
                id: '',
                name: '',
                notes: '',
                subTasks: [],
                subTaskId: 0,
                tags: [],
                frecuency: 'd1',
                streak: 0,
                completed: false,
            } as ITaskDaily;
        },

        UPDATE_CURRENT_TASK(state: any, id: string) {
            const task = state.tasks.find((t: ITaskDaily) => {
                return t.id === id;
            });

            if (task) {
                state.current = task;
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

        INCREASE_CURRENT_SUBTASK_COUNTER(state: any) {
            state.current.subTaskId++;
        },

        ADD_CURRENT_SUBTASK(state: any, task: ISubTask) {
            state.current.subTasks.push(task);
        },

        DELETE_CURRENT_SUBTASK(state: any, id: number) {
            const i = state.current.subTasks.findIndex((e: ISubTask) => {
                return e.id === id;
            });

            if (i >= 0) {
                state.current.subTasks.splice(i, 1);
            }
        },

        UPDATE_CURRENT_SUBTASK_NAME(state: any, subTask: any) {
            const i = state.current.subTasks.findIndex((e: ISubTask) => {
                return e.id === subTask.id;
            });

            if (i >= 0) {
                state.current.subTasks[i].name = subTask.name;
            }
        },

        // Tags of Current Task
        ADD_CURRENT_TAG(state: any, tagId: string) {
            const i = state.current.tags.findIndex((t: string) => {
                return t === tagId;
            });

            if (i === -1) {
                state.current.tags.push(tagId);
            }
        },

        DELETE_CURRENT_TAG(state: any, tagId: string) {
            const i = state.current.tags.findIndex((t: string) => {
                return t === tagId;
            });

            if (i >= 0) {
                state.current.tags.splice(i, 1);
            }
        },

        // Tags
        ADD_TAG(state: any, args: any) {
            const {tag, id} = args;
            const i = state.tasks.findIndex((t: ITaskDaily) => {
                return t.id === id;
            });

            if (i >= 0) {
                state.tasks[i].tags.push(tag);
            }
        },

        // Borra las etiquetas que ya no existan en el módulo tag
        CLEAN_TAGS(state: any, id: string) {
            for (const t of state.tasks) {
                const i = t.tags.findIndex((tag: string) => {
                    return tag === id;
                });

                if (i >= 0) {
                    t.tags.splice(i, 1);
                }
            }
        },
    },

    actions: {
        updateCounter: (context: any) => {
            context.commit('INCREASE_ID_COUNTER');
        },

        addTask: (context: any, task: ITaskDaily) => {
            context.commit('ADD_TASK', task);
        },

        updateTask: (context: any, task: ITaskDaily) => {
            context.commit('UPDATE_TASK', task);
        },

        deleteTask: (context: any, id: string) => {
            context.commit('DELETE_TASK', id);
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

        updateCheck: (context: any, payload: any) => {
            context.commit('UPDATE_SUBTASK_CHECK', payload);
        },

        updateCurrent: (context: any, id: string) => {
            context.commit('UPDATE_CURRENT_TASK', id);
        },

        addCurrentSubTask: (context: any, task: ISubTask) => {
            context.commit('ADD_CURRENT_SUBTASK', task);
        },

        deleteCurrentSubTask: (context: any, id: string) => {
            context.commit('DELETE_CURRENT_SUBTASK', id);
        },

        updateCurrentSubTaskName: (context: any, subTask: any) => {
            context.commit('UPDATE_CURRENT_SUBTASK_NAME', subTask);
        },

        // Tags of Current Task
        addCurrentTag: (context: any, tagId: string) => {
            context.commit('ADD_CURRENT_TAG', tagId);
        },

        deleteCurrentTag: (context: any, tagId: string) => {
            context.commit('DELETE_CURRENT_TAG', tagId);
        },

        // Tags
        addTag: (context: any, args: any) => {
            const {tag, id} = args;
            context.commit('ADD_TAG', args);
        },
    },
};
