<template>
    <div class="card tag-card" :class="{ 'tag-card-focus': onFocus }" ref="tag">
        <div class="card-header">
            <span v-if="isModal"></span>
            <input ref="tagName" 
                @focus="onFocus = true"
                @blur="updateName(); onFocus = false" 
                @keydown.enter="updateName" 
                class="tag-name" 
                type="text" 
                :value="name">
            <span class="tag-select-color-icon">
                <svg @click="showOptionsMenu = !showOptionsMenu" class="icon" width="24" height="24" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 0h24v24H0z" fill="none"/>
                    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                </svg>
                <context-menu 
                    @action="handleOptionsMenu"
                    @close="showOptionsMenu = false" 
                    :items="options"
                    :position="'right'" 
                    v-if="showOptionsMenu">
                </context-menu>
            </span>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import ContextMenu from './ContextMenu.vue';

@Component({
    components: { ContextMenu },
})

export default class Tag extends Vue {
    @Prop() private id!: string;
    @Prop() private name!: string;
    @Prop({ default: '#7400C9' }) private color!: string;
    @Prop({ default: false }) private isModal!: boolean;
    @Prop({ default: null }) private type!: string;

    private showOptionsMenu: boolean = false;
    private onFocus: boolean = false;
    private options: object[] = [
        {
            name: 'Editar',
            src: require('../assets/pen-solid.svg'),
        },
        {
            name: 'Color',
            src: require('../assets/eye-dropper-solid.svg'),
        },
        {
            name: 'Borrar',
            src: require('../assets/trash-solid.svg'),
        },
    ];

    private updateName() {
        const eName = this.$refs.tagName as HTMLInputElement;
        const name = eName.value;
        const current = this.$store.state.tag.tags[this.id].name;

        if (!name) {
            eName.value = current;
            return;
        }

        if (name === current) { return; }

        const tag = {
            name,
            color: this.color,
        } as ITag;

        this.$store.dispatch('tag/updateTag', {id: this.id, tag});
    }

    private deleteTag() {
        if (this.isModal) {
            this.$store.dispatch(this.type + '/deleteCurrentTag', this.id);
            return;
        }

        this.$store.dispatch('tag/deleteTag', this.id);
    }

    private handleOptionsMenu(payload: number): void {
        switch (payload) {
            case 0:
                (this.$refs.tagName as HTMLInputElement).focus();
                break;
            case 1:
                // Cambiar color
                break;
            case 2:
                this.deleteTag();
                break;
        }
    }
}
</script>

<style lang="scss">
    @import '../scss/variables';

    .tag-name {
        border: none;
        background-color: white;
        font-family: $montserrat;
        width: 100%;
    }

    .tag-name:focus {
        outline: none;
    }

    .tag-card {
        border-width: 1px 1px 1px 5px;
        border-top-color: white;
        border-right-color:white;
        border-bottom-color:white;
        margin-left: 7px;
        margin-right: 7px;
        padding: 7px 12px;
    }

    .tag-card-focus {
        border-color: $primary;
    }

    .tag-select-color-icon {
        // Relative para prevenir que el menú contextual se posicione
        // en la derecha de la pantalla
        position: relative;
        margin-left: 7px;
    }

    .tag-select-color-icon svg {
        fill: $grey400;
    }

    .tag-select-color-icon:hover svg {
        fill: $grey800;
    }
</style>
