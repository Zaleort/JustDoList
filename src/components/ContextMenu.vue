<template>
    <div ref="menu" :class="'cm-container cm-' + position">
        <ul class="cm-list">
            <li class="relative" :class="checkDisabled(item.disabled)"
                @click="emitAction(item.disabled, index)"
                v-for="(item, index) in items" 
                :key="index">
                    <img class="cm-item-icon" :src="item.src" alt="">
                    <span>{{ item.name }}</span>
                    <ul class="cm-sublist" v-if="item.subMenu && item.type !== 'color'">
                        <li v-for="(sub, subIndex) in item.subMenu" 
                            :key="subIndex"
                            :class="checkDisabled(sub.disabled)" 
                            @click="emitAction(item.disabled, index, subIndex)">
                                <span>{{ sub.name }}</span>
                        </li>
                    </ul>
                    <div class="cm-colorpicker" v-if="item.subMenu && item.type === 'color'">
                        <div @click="emitColorChange(0)" class="bg-red"></div>
                        <div @click="emitColorChange(1)" class="bg-orange"></div>
                        <div @click="emitColorChange(2)" class="bg-yellow"></div>
                        <div @click="emitColorChange(3)" class="bg-green"></div>
                        <div @click="emitColorChange(4)" class="bg-teal"></div>
                        <div @click="emitColorChange(5)" class="bg-blue"></div>
                        <div @click="emitColorChange(6)" class="bg-indigo"></div>
                        <div @click="emitColorChange(7)" class="bg-purple"></div>
                        <div @click="emitColorChange(8)" class="bg-pink"></div>
                    </div>
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class ContextMenu extends Vue {
    @Prop() private items!: object[];
    @Prop({default: 'right'}) private position!: string;

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

    private checkDisabled(isDisabled: boolean): string {
        if (isDisabled) {
            return 'cm-item disabled';
        }

        return 'cm-item';
    }

    private emitAction(isDisabled: boolean, index: number) {
        if (isDisabled) { return; }

        this.$emit('action', index);
        this.$emit('close');
    }

    private emitColorChange(index: number) {
        this.$emit('color', index);
        this.$emit('close');
    }

}
</script>

<style lang="scss">
    @import '../scss/variables';

    .cm-container {
        position: absolute;
        user-select: none;
        width: 150px;
        z-index: 9999;
    }

    .cm-right {
        right: 0;
    }

    .cm-left {
        left: 0;
    }

    .cm-list {
        background-color: #fff;
        box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
        width: 100%;
        margin: 0;
        padding: 0;
        list-style-type: none;
    }

    .cm-item {
        display: flex;
        align-items: center;
        width: 100%;
        font-style: normal;
        padding: 12px 16px;
        transition: all 0.15s;
    }

    .cm-item:hover {
        cursor: pointer;
        background-color: $grey100;
    }

    .cm-item.disabled:hover {
        cursor: unset;
        background-color: #fff;
    }

    .cm-item-icon {
        width: 14px;
        margin-right: 7px;
    }

    .cm-colorpicker {
        display: flex;
        width: 90px;
        flex-wrap: wrap;
        visibility: hidden;
        position: absolute;
        left: -90px;
        top: 0;

        div {
            cursor: pointer;
            flex: 1 0 33%;
            width: 30px;
            height: 30px;
        }
    }

    .cm-item:hover .cm-colorpicker {
        visibility: visible;
    }
</style>
