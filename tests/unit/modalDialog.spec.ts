import { shallowMount } from '@vue/test-utils';
import ModalDialog from '@/components/ModalDialog.vue';

const factory = (props = {}) => {
    return shallowMount(ModalDialog, {
        propsData: { ...props },
    });
};

describe('ModalDialog.vue', () => {
    it('Se cierra al hacer click en el contenedor', () => {
        const wrapper = factory();
        wrapper.find('.dialog-container').trigger('click');
        expect(wrapper.emitted().close).toBeTruthy();
    });

    it('No se cierra al hacer click en el contenido', () => {
        const wrapper = factory();
        wrapper.find('.dialog-content').trigger('click');
        expect(wrapper.emitted().close).toBeFalsy();
    });
});
