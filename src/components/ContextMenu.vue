<template>
    <div ref="menu" class="cm-container">
        <ul class="cm-list">
            <li class="cm-item"
                @click="$emit('action', index)" 
                v-for="(item, index) in items" 
                :key="index">
                    <i><img :src="item.src" alt=""></i>
                    <span>{{ item.name }}</span>
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class ContextMenu extends Vue {
    @Prop() private items!: object[];

    private mounted() {
        document.addEventListener('click', this.handle, true);
    }

    private beforeDestroy() {
        document.removeEventListener('click', this.handle, true);
    }

    private handle(e: any) {
        const el = this.$refs.menu as HTMLElement;

        if (!el.contains(e.target) && !el.parentNode!.contains(e.target)) {
            this.$emit('close');
        }
    }

}
</script>

<style lang="scss">
    @import '../scss/variables';

    .cm-container {
        position: absolute;
        user-select: none;
        width: 100px;
        right: 0;
        z-index: 9999;
    }

    .cm-list {
        background-color: white;
        box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
        width: 100%;
        margin: 0;
        padding: 0;
        list-style-type: none;
    }

    .cm-item {
        width: 100%;
        font-style: normal;
        padding: 12px 16px;
        transition: all 0.15s;
    }

    .cm-item:hover {
        background-color: $primary;
        color: $grey200;
    }
</style>