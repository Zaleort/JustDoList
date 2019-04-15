import { shallowMount } from '@vue/test-utils';
import Task from '@/components/Task.vue';
import ContextMenu from '@/components/ContextMenu.vue';

const factory = (data = {}, props = {}) => {
    return shallowMount(Task, {
        data() {
            return { ...data  };
        },

        propsData: { ...props },
    });
};

describe('Task.vue', () => {
    it('Muestra el nombre de la tarea', () => {
        const wrapper = factory({}, { name: 'Task' });
        expect(wrapper.find('.checkbox-title').text()).toBe('Task');
    });

    it('Renderiza el botón de expansión si hay subtareas', () => {
        const wrapper = factory({}, { subTasks: [{id: 1, name: 'Prueba', checked: false}] });
        expect(wrapper.find('.expand-icon').exists()).toBeTruthy();
    });

    it('No renderiza el botón de expansión si no hay subtareas', () => {
        const wrapper = factory({}, { subTasks: [{id: 1, name: 'Prueba', checked: false}] });
        expect(wrapper.find('.expand-icon').exists()).toBeTruthy();
    });

    it('Renderiza las subtareas si existen', () => {
        const wrapper = factory({}, { subTasks: [{id: 1, name: 'Prueba', checked: false}] });
        expect(wrapper.find('.task-subtasks-list').exists()).toBeTruthy();
    });

    it('No renderiza el contenedor si no existen subtareas', () => {
        const wrapper = factory();
        expect(wrapper.find('.task-subtasks-list').exists()).toBeFalsy();
    });

    it('Renderiza las notas si existen', () => {
        const wrapper = factory({}, { notes: 'Notes' });
        expect(wrapper.find('.task-notes').exists()).toBeTruthy();
    });

    it('Muestra correctamente las notas', () => {
        const wrapper = factory({}, { notes: 'Notes' });
        expect(wrapper.find('.task-notes').text()).toBe('Notes');
    });

    it('No renderiza las notas si no existen', () => {
        const wrapper = factory();
        expect(wrapper.find('.task-notes').exists()).toBeFalsy();
    });

    it('No renderiza las notas si están vacías', () => {
        const wrapper = factory({}, { notes: '' });
        expect(wrapper.find('.task-notes').exists()).toBeFalsy();
    });

    it('Al hacer click en el botón de expansión oculta los elementos', () => {
        const wrapper = factory({}, { subTasks: [{id: 1, name: 'Prueba', checked: false}] });
        const button = wrapper.find('.expand-icon');
        button.trigger('click');

        expect(wrapper.find('.task-subtasks-hide').exists()).toBeTruthy();
    });

    it('Muestra el menú contextual si showOptionsMenu es verdadero', () => {
        const wrapper = factory({ showOptionsMenu: true });
        expect(wrapper.find(ContextMenu).exists()).toBeTruthy();
    });

    it('No muestra el menú contextual si showOptionsMenu es falso', () => {
        const wrapper = factory({ showOptionsMenu: false });
        expect(wrapper.find(ContextMenu).exists()).toBeFalsy();
    });

    it('Cierra el menú contextual al recibir el evento close', () => {
        const wrapper = factory({ showOptionsMenu: true });
        wrapper.find(ContextMenu).vm.$emit('close');
        expect(wrapper.find(ContextMenu).exists()).toBeFalsy();
    });
});
