<template>
    <div class="card tag-card" ref="tag">
        <div class="card-header">
            <input ref="tagName" @blur="updateName" class="tag-name" type="text" :value="name">
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
    @Prop() private color!: string;

    private showOptionsMenu: boolean = false;
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
        const current = this.$store.state.tag.tags.find((x: ITag) => x.id === this.id).name;

        if (!name) {
            eName.value = current;
            return;
        }

        if (name === current) { return; }

        const tag = {
            id: this.id,
            name,
            color: this.color,
        } as ITag;

        this.$store.dispatch('tag/updateTag', tag);
    }

    private deleteTag() {
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

    .tag-card {
        border-left-width: 5px;
        margin-left: 7px;
        margin-right: 7px;
        padding: 7px 12px;
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
