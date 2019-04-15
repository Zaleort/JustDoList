import { shallowMount } from '@vue/test-utils';
import SubTask from '@/components/SubTask.vue';

const factory = (props = {}) => {
    return shallowMount(SubTask, {
        propsData: { ...props },
        methods,
    });
};

const methods = {
    updateCheck: jest.fn(),
};

describe('SubTask.vue', () => {
    it('Muestra el nombre de la subtarea', () => {
        const wrapper = factory({ name: 'Name' });
        expect(wrapper.find('.checkbox-title').text()).toBe('Name');
    });

    it('Muestra correctamente el estado de checked cuando es verdadero', () => {
        const wrapper = factory({ checked: true });
        const input = wrapper.find('input').element as HTMLInputElement;
        expect(input.checked).toBeTruthy();
    });

    it('Muestra correctamente el estado de checked cuando es falso', () => {
        const wrapper = factory({ checked: false });
        const input = wrapper.find('input').element as HTMLInputElement;
        expect(input.checked).toBeFalsy();
    });

    it('Ejecuta la actualización del estado de checked', () => {
        const wrapper = factory({ checked: false });
        wrapper.find('.checkbox-group--sm').trigger('click');
        expect(methods.updateCheck).toHaveBeenCalled();
    });
});
