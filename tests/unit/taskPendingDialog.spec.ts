import Vue from 'vue';
import Vuex from 'vuex';
import { mount } from '@vue/test-utils';
import TaskPendingDialog from '@/components/TaskPendingDialog.vue';
import ModalDialog from '@/components/ModalDialog.vue';
import TaskPendingModule from '@/store_modules/TaskPendingModule';

Vue.use(Vuex);

const store = new Vuex.Store({
    modules: {
        pending: TaskPendingModule,
    },
});

const factory = (props = {}, methods = {}) => {
    return mount(TaskPendingDialog, {
        propsData: { ...props },
        components: { ModalDialog },
        store,
        methods,
    });
};

describe('TaskPendingDialog.vue', () => {
    it('Validate debe devolver falso si el nombre está vacío', () => {
        const wrapper = factory();
        (wrapper.vm.$refs.taskName as HTMLInputElement).value = '';
        expect((wrapper.vm as any).validateTaskName()).toBeFalsy();
    });

    it('Validate debe devolver falso si el nombre contiene sólo espacios', () => {
        const wrapper = factory();
        (wrapper.vm.$refs.taskName as HTMLInputElement).value = '       ';
        expect((wrapper.vm as any).validateTaskName()).toBeFalsy();
    });

    it('Validate debe devolver verdadero si el nombre contiene algún carácter', () => {
        const wrapper = factory();
        (wrapper.vm.$refs.taskName as HTMLInputElement).value = 'a';
        expect((wrapper.vm as any).validateTaskName()).toBeTruthy();
    });

    it('Muestra el título correctamente', () => {
        const wrapper = factory({ heading: 'Editar tarea' });
        expect((wrapper.vm.$refs.taskHeading as HTMLElement).innerHTML).toBe('Editar tarea');
    });

    it('Muestra el nombre de la tarea', () => {
        const wrapper = factory();
        const taskName = wrapper.vm.$refs.taskName as HTMLInputElement;

        const current = {
            id: '',
            name: 'Antonio',
            notes: '',
            subTasks: [],
            subTaskId: 0,
        };

        wrapper.vm.$store.commit('pending/UPDATE_CURRENT_TASK', current);
        expect(taskName.value).toBe('Antonio');
    });

    it('Muestra las notas de la tarea', () => {
        const wrapper = factory();
        const taskNotes = wrapper.vm.$refs.taskNotes as HTMLInputElement;

        const current = {
            id: '',
            name: 'Antonio',
            notes: 'Amigo',
            subTasks: [],
            subTaskId: 0,
        };

        wrapper.vm.$store.commit('pending/UPDATE_CURRENT_TASK', current);
        expect(taskNotes.value).toBe('Amigo');
    });

    it('Muestra las subtareas de la tarea', () => {
        const wrapper = factory();
        const current = {
            id: '',
            name: '',
            notes: '',
            subTasks: [
                {
                    id: 0,
                    name: 'Name',
                    checked: false,
                },
                {
                    id: 1,
                    name: 'Cosa',
                    checked: false,
                },
            ],
            subTaskId: 1,
        };

        wrapper.vm.$store.commit('pending/UPDATE_CURRENT_TASK', current);
        const subTasks = wrapper.findAll('input').filter((w) => w.classes('right-icon'));
        expect((subTasks.at(0).element as HTMLInputElement).value).toBe('Name');
        expect((subTasks.at(1).element as HTMLInputElement).value).toBe('Cosa');
    });

    it('Valida el nombre de la tarea @blur', () => {
        const methods = {
            validateTaskName: jest.fn(),
        };

        const wrapper = factory({}, methods);
        const input = wrapper.find({ ref: 'taskName' });
        input.trigger('focus');
        input.trigger('blur');

        expect(methods.validateTaskName).toHaveBeenCalled();
    });

    it('Procesa los datos @keydown.enter al estar modificando el nombre de la tarea', () => {
        const methods = {
            submit: jest.fn(),
        };

        const wrapper = factory({}, methods);
        const input = wrapper.find({ ref: 'taskName' });
        input.trigger('focus');
        input.trigger('keydown.enter');

        expect(methods.submit).toHaveBeenCalled();
    });
});
