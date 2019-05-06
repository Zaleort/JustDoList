import TaskDailyModule from '../../src/store_modules/TaskDailyModule';

const mutations = TaskDailyModule.mutations;

describe('Task Pending Mutations', () => {
    it('Incrementa el ID de la Tarea', () => {
        const state = { idCounter: '0' };
        mutations.INCREASE_ID_COUNTER(state);
        expect(state.idCounter).toBe('1');
    });

    it('Añade tareas', () => {
        const state = { tasks: [] };
        mutations.ADD_TASK(state, { id: '0', name: 'Peter', notes: '', subTaskId: 0, subTasks: [], tags: [] });
        expect(state.tasks.length).toBe(1);
    });

    it('Actualiza tareas', () => {
        const state = { tasks: [{ id: '0', name: 'Peter', notes: '', subTaskId: 0, subTasks: [], tags: [] }] };
        mutations.UPDATE_TASK(state, { id: '0', name: 'Pato', notes: '', subTaskId: 0, subTasks: [], tags: [] });
        expect(state.tasks[0].name).toBe('Pato');
    });

    it('Completa tareas', () => {
        const state = { tasks: [{ id: '0', name: 'Peter', notes: '', subTaskId: 0, subTasks: [] }] };
        mutations.COMPLETE_TASK(state, '0');
        expect(state.tasks.length).toBe(0);
    });

    it('Mueve una tarea hacia arriba', () => {
        const state = { tasks: [
            { id: '0', name: 'Peter', notes: '', subTaskId: 0, subTasks: [] },
            { id: '1', name: 'Antonio', notes: '', subTaskId: 0, subTasks: [] },
            { id: '2', name: 'Jorge', notes: '', subTaskId: 0, subTasks: [] },
        ] };

        mutations.MOVE_TASK_UP(state, '2');
        expect(state.tasks[1].id).toBe('2');
    });

    it('Si la tarea ya es la primera, se mantiene en su posición', () => {
        const state = { tasks: [
            { id: '0', name: 'Peter', notes: '', subTaskId: 0, subTasks: [] },
            { id: '1', name: 'Antonio', notes: '', subTaskId: 0, subTasks: [] },
            { id: '2', name: 'Jorge', notes: '', subTaskId: 0, subTasks: [] },
        ] };

        mutations.MOVE_TASK_UP(state, '0');
        expect(state.tasks[0].id).toBe('0');
    });

    it('Mueve una tarea hacia abajo', () => {
        const state = { tasks: [
            { id: '0', name: 'Peter', notes: '', subTaskId: 0, subTasks: [] },
            { id: '1', name: 'Antonio', notes: '', subTaskId: 0, subTasks: [] },
            { id: '2', name: 'Jorge', notes: '', subTaskId: 0, subTasks: [] },
        ] };

        mutations.MOVE_TASK_DOWN(state, '1');
        expect(state.tasks[1].id).toBe('2');
    });

    it('Si la tarea ya es la última, se mantiene en su posición', () => {
        const state = { tasks: [
            { id: '0', name: 'Peter', notes: '', subTaskId: 0, subTasks: [] },
            { id: '1', name: 'Antonio', notes: '', subTaskId: 0, subTasks: [] },
            { id: '2', name: 'Jorge', notes: '', subTaskId: 0, subTasks: [] },
        ] };

        mutations.MOVE_TASK_DOWN(state, '2');
        expect(state.tasks[2].id).toBe('2');
    });

    it('Actualiza la propiedad checked de una subtarea', () => {
        const state = {
            tasks: [
                {
                    id: '0',
                    name: 'Peter',
                    notes: '',
                    subTaskId: 0,
                    subTasks: [{ id: 0, name: 'SubTarea 1', checked: false }],
                },
            ],
        };

        mutations.UPDATE_SUBTASK_CHECK(state, { taskId: '0', id: 0, checked: true });
        expect(state.tasks[0].subTasks[0].checked).toBeTruthy();
    });

    it('Actualiza la Tarea Actual', () => {
        const state = { current: {} };
        const task = { id: '0', name: 'Peter', notes: '', subTaskId: 0, subTasks: [], tags: [] };
        mutations.UPDATE_CURRENT_TASK(state, task);
        expect(state.current).toEqual(task);
    });

    it('Incrementa el contador ID de las subtareas de la Tarea Actual', () => {
        const state = { current: {
            id: '0',
            name: 'Peter',
            notes: '',
            subTaskId: 0,
            subTasks: [{ id: 0, name: 'SubTarea 1', checked: false }],
        }};

        mutations.INCREASE_CURRENT_SUBTASK_COUNTER(state);
        expect(state.current.subTaskId).toBe(1);
    });

    it('Añade una subtarea a la Tarea Actual', () => {
        const state = { current: {
            id: '0',
            name: 'Peter',
            notes: '',
            subTaskId: 0,
            subTasks: [],
        }};

        const subTask = { id: 0, name: 'SubTarea 1', checked: false };
        mutations.ADD_CURRENT_SUBTASK(state, subTask);
        expect(state.current.subTasks.length).toBe(1);
    });

    it('Borra una subtarea a la Tarea Actual', () => {
        const state = { current: {
            id: '0',
            name: 'Peter',
            notes: '',
            subTaskId: 0,
            subTasks: [{ id: 0, name: 'SubTarea 1', checked: false }],
        }};

        mutations.DELETE_CURRENT_SUBTASK(state, 0);
        expect(state.current.subTasks.length).toBe(0);
    });

    it('Actualiza una subtarea a la Tarea Actual', () => {
        const state = { current: {
            id: '0',
            name: 'Peter',
            notes: '',
            subTaskId: 0,
            subTasks: [{ id: 0, name: 'SubTarea 1', checked: false }],
        }};

        const subTask = { id: 0, name: 'Modificada', checked: false };
        mutations.UPDATE_CURRENT_SUBTASK_NAME(state, subTask);
        expect(state.current.subTasks[0].name).toBe('Modificada');
    });
});
