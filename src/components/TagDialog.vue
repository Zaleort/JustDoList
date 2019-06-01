<template>
    <modal-dialog :show="show" @close="closeDialog">
        <div class="dialog-header" :key="'header'">
            <h1 class="font-white dialog-title">Configuración de etiquetas</h1>
        </div>

        <transition-group
            tag="div"
            class="dialog-form"
            enter-active-class="animate faster fade-in-up-slight"
            leave-active-class="absolute animate fastest fade-out"
            move-class="move">
            
            <label class="dialog-form-group" :key="'form'">
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
            <div :key="'tags'">
                <p class="dialog-form-name">Etiquetas</p>
                <transition-group
                    tag="div"
                    class="tag-cloud"
                    enter-active-class="animate faster fade-in-up-slight"
                    move-class="move">
                        <tag v-for="(tag, id) in tags" :key="id" :id="id" v-bind="tag" />
                </transition-group>
            </div>
            <div class="dialog-footer" :key="'footer'">
                <input @click="closeDialog" class="mr-1 cancel-button button button-alpha font-danger" type="button" value="Cerrar">
            </div>
        </transition-group>
    </modal-dialog>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import ModalDialog from './ModalDialog.vue';
import Tag from './Tag.vue';
import { mapState } from 'vuex';

@Component({
    components: { ModalDialog, Tag },

    computed: {
        ...mapState('tag', {
            tags: (state: TagsState) => state.tags,
        }),
    },
})

export default class TagDialog extends Vue {
    @Prop() private show!: boolean;

    private tags!: ITags;

    private addTag(): void {
        let tag: ITag;

        const tagName = (this.$refs.tagName as HTMLInputElement);
        if (!this.validateTagName(tagName.value)) { return; }

        tag = {
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
        flex-direction: column;
    }

    @media only screen and (min-width: $mobile-l) {
        .tag-cloud {
            flex-direction: row;
            justify-content: space-between;
            flex-wrap: wrap;
        }

        .tag-cloud > .tag-card {
            flex-grow: 1;
            flex: 0 1 48%;
        }
    }
</style>
