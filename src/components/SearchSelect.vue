<template>
    <div class="relative" ref="searchSelect">
        <span @click="selectCustom()" class="text-input-icon left">
            <svg class="icon" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                <path fill="#4caf50" d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"></path>
            </svg>
        </span>
        <input ref="input"
            class="text-input left-icon full-width" 
            type="text"
            @focus="openDropdown = true; filter()"
            @keydown.enter="selectCustom()"
            @keyup="filter()"
            :placeholder="placeholder">
        <div v-show="openDropdown" class="ss-container">
            <span v-show="filteredItems.length === 0" class="ss-no-results">{{ noResults }}</span>
            <ul class="ss-dropdown">
                <li @click.prevent="setSelected(item.id)"
                    v-for="item of filteredItems" 
                    :key="item.id">
                    {{ item.name }}
                </li>
            </ul>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class SearchSelect extends Vue {
    @Prop() private items!: any;
    @Prop() private placeholder!: string;
    @Prop({ default: 'Sin resultados' }) private noResults!: string;

    private filteredItems = this.items || [];
    private openDropdown = false;

    private mounted() {
        document.addEventListener('click', this.handle, true);
    }

    private beforeDestroy() {
        document.removeEventListener('click', this.handle, true);
    }

    private handle(e: any) {
        const el = this.$refs.searchSelect as HTMLElement;

        if (!el.contains(e.target) && !el.parentNode!.contains(e.target)) {
            this.openDropdown = false;
        }
    }

    private setSelected(id: string) {
        this.openDropdown = false;
        this.$emit('selected', id);
    }

    private selectCustom() {
        const el = (this.$refs.input as HTMLInputElement).value;
        const exists = this.items.find((i: any) => {
            return i.name === el
                || i.name.localeCompare(el, undefined, { sensitivity: 'accent' }) === 0;
        });

        if (exists) {
            this.$emit('selected', exists.id);
        } else {
            this.$emit('created', el);
        }

        this.openDropdown = false;
        (this.$refs.input as HTMLInputElement).value = '';
        (this.$refs.input as HTMLInputElement).blur();
    }

    private filter() {
        const value = (this.$refs.input as HTMLInputElement).value;
        if (!value) {
            this.filteredItems = this.items;
            return;
        }

        const arr = this.items.filter((i: any) => {
            return i.name.includes(value);
        });

        this.filteredItems = arr;
    }
}
</script>

<style lang="scss" scoped>
    @import '../scss/variables';

    .ss-container {
        position: absolute;
        background-color: #fff;
        box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
        left: 0;
        width: 100%;
        overflow: auto;
        max-height: 125px;
        z-index: 9999;
    }

    .ss-dropdown {
        width: 100%;
        margin: 0;
        padding: 0;
        list-style-type: none;

        li {
            width: 100%;
            font-style: normal;
            font-size: 0.9em;
            padding: 8px 12px;
            transition: all 0.15s;
        }

        li:hover {
            cursor: pointer;
            background-color: $grey100;
        }
    }

    .ss-no-results {
        display: block;
        color: $grey500;
        font-style: italic;
        text-align: center;
        width: 100%;
        font-size: 0.9em;
        padding: 8px 12px;
    }
</style>
