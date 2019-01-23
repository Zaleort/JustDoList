<template>
    <modal-dialog :show="show" @close="closeDialog">
        <div class="dialog-header">
            <h1 class="font-white dialog-title">Configuración de etiquetas</h1>
        </div>
        <div class="dialog-form">
            <label class="dialog-form-group">
                <p class="dialog-form-name">Añadir nueva etiqueta</p>
                <div class="relative">
                    <span @click="addTag" class="text-input-icon left">
                        <svg class="icon" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                            <path fill="#4caf50" d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"></path>
                        </svg>
                    </span>
                    <input @keydown.enter="addTag"
                        ref="tagName" 
                        class="text-input left-icon full-width" 
                        placeholder="Trabajo" 
                        type="text">
                </div>
            </label>
            <div>
                <p class="dialog-form-name">Etiquetas</p>
                <transition-group
                    tag="div"
                    class="tag-cloud"
                    enter-active-class="animate faster fade-in-up-slight"
                    leave-active-class="absolute animate fastest fade-out"
                    move-class="move">
                        <tag v-for="tag in tags" :key="tag.name" v-bind="tag" />
                </transition-group>
            </div>
            <div class="dialog-footer">
                <input @click="closeDialog" class="mr-1 cancel-button button button-alpha font-danger" type="button" value="Cancelar">
                <input ref="tagSubmit" class="save-button button button-success" type="submit" value="Guardar">
            </div>
        </div>
    </modal-dialog>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import ModalDialog from './ModalDialog.vue';
import Tag from './Tag.vue';

@Component({
    components: { ModalDialog, Tag },
})

export default class TagDialog extends Vue {
    @Prop() private show!: boolean;

    get tags() {
        return this.$store.state.tag.tags;
    }

    private addTag(): void {
        const tagName = (this.$refs.tagName as HTMLInputElement);
        if (!this.validateTagName(tagName.value)) { return; }

        const tag = {
            name: tagName.value,
            color: '#7400C9',
        };

        tagName.value = '';
        this.$store.dispatch('tag/addTag', tag);
    }

    private validateTagName(name: string): boolean {
        if (!name || name.trim().length === 0) {
            return false;
        }

        return true;
    }

    private closeDialog(): void {
        this.$emit('close');
    }
}
</script>

<style lang="scss">
    @import '../scss/variables';

    .tag-cloud {
        display: flex;
        flex-wrap: wrap;
    }
</style>
