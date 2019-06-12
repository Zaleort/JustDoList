<template>
    <div class="card tag-card" :class="[focusClass, borderColor]" ref="tag">
        <div class="card-header">
            <span @click="setFavorite" v-if="isModal" class="icon tag-star-icon" :class="{ 'tag-star-icon-fav': isFavorite }">
                <svg width="18" height="18" aria-hidden="true" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                    <path d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"></path>
                </svg>
            </span>
            <input ref="tagName" 
                @focus="onFocus = true"
                @blur="updateName(); onFocus = false" 
                @keydown.enter="updateName" 
                class="tag-name" 
                type="text" 
                :value="name">
            <span class="tag-options-icon">
                <svg @click="showOptionsMenu = !showOptionsMenu" class="icon" width="24" height="24" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 0h24v24H0z" fill="none"/>
                    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                </svg>
                <context-menu 
                    @action="handleOptionsMenu"
                    @close="showOptionsMenu = false"
                    @color="changeColor" 
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
    @Prop({ default: 'purple' }) private color!: string;
    @Prop({ default: false }) private isModal!: boolean;
    @Prop({ default: false }) private isFavorite!: boolean;
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
            subMenu: [
                { name: 'Rojo' },
                { name: 'Naranja' },
                { name: 'Amarillo' },
                { name: 'Verde' },
                { name: 'Verde Agua' },
                { name: 'Azul' },
                { name: 'Indigo' },
                { name: 'Morado' },
                { name: 'Rosa' },
            ],
            type: 'color',
        },
        {
            name: 'Borrar',
            src: require('../assets/trash-solid.svg'),
        },
    ];

    get borderColor(): string {
        return 'border-' + this.color;
    }

    get focusClass() {
        if (this.onFocus) {
            return 'tag-card-focus-' + this.color;
        }
    }

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

    private changeColor(payload: number): void {
        switch (payload) {
            case 0:
                this.$store.dispatch('tag/setColor', {id: this.id, color: 'red'});
                break;
            case 1:
                this.$store.dispatch('tag/setColor', {id: this.id, color: 'orange'});
                break;
            case 2:
                this.$store.dispatch('tag/setColor', {id: this.id, color: 'yellow'});
                break;
            case 3:
                this.$store.dispatch('tag/setColor', {id: this.id, color: 'green'});
                break;
            case 4:
                this.$store.dispatch('tag/setColor', {id: this.id, color: 'teal'});
                break;
            case 5:
                this.$store.dispatch('tag/setColor', {id: this.id, color: 'blue'});
                break;
            case 6:
                this.$store.dispatch('tag/setColor', {id: this.id, color: 'indigo'});
                break;
            case 7:
                this.$store.dispatch('tag/setColor', {id: this.id, color: 'purple'});
                break;
            case 8:
                this.$store.dispatch('tag/setColor', {id: this.id, color: 'pink'});
                break;
        }
    }

    private setFavorite() {
        if (!this.isModal) { return; }
        if (this.isFavorite) { return; }

        this.$store.commit(this.type + '/SET_FAVORITE_TAG', this.id);
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
        padding: 7px 12px;
    }

    .tag-card-focus-purple { border-color: $primary; }
    .tag-card-focus-indigo { border-color: $indigo500; }
    .tag-card-focus-blue { border-color: $blue500; }
    .tag-card-focus-teal { border-color: $teal500; }
    .tag-card-focus-green { border-color: $green500; }
    .tag-card-focus-yellow { border-color: $yellow700; }
    .tag-card-focus-orange { border-color: $orange500; }
    .tag-card-focus-red { border-color: $red500; }
    .tag-card-focus-pink { border-color: $pink500; }

    .tag-star-icon {
        margin-right: 7px;
    }

    .tag-options-icon {
        // Relative para prevenir que el menú contextual se posicione
        // en la derecha de la pantalla
        position: relative;
        margin-left: 7px;
    }

    .tag-options-icon svg, .tag-star-icon svg {
        fill: $grey400;
    }

    .tag-options-icon:hover svg, .tag-star-icon:hover svg {
        fill: $grey800;
    }

    .tag-star-icon-fav svg {
        fill: $yellow700;
    }

    .tag-star-icon-fav:hover svg {
        fill: $yellow900;
    }
</style>
