<template>
    <div class="tarea-card">
        <div class="tarea-card-header">
            <label class="checkbox-group">
                <input class="checkbox" type="checkbox" name="" id="">
                <div class="checkbox-indicator"></div>
                {{ titulo }}
            </label>
            <svg class="icon expand-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                <path d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z"></path>
            </svg>
            <svg class="icon tarea-options-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 0h24v24H0z" fill="none"/>
                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class TareaElement extends Vue {
    @Prop({ default: 'Tarea 1' })
    private titulo: any;
}
</script>


<style lang="scss">
    @import '../scss/variables';

    .tarea-card {
        margin-top: 12px;
        background-color: #ffffff;
        border-left: 9px solid $primary;
        padding: 21px 16px;
        box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
    }

    .tarea-card-header {
        display: flex;
        align-items: center;
    }

    .expand-icon {
        margin-left: 12px;
        fill: $grey400;
        width: 18px;
        height: 18px;
    }

    .expand-icon.expanded {
        transform: rotate(180deg);
    }

    .tarea-options-icon {
        width: 28px;
        height: 28px;
        fill: $grey400;
        margin-left: auto;
    }

    .checkbox-group {
        display: flex;
        align-items: center;
        cursor: pointer;
    }

    .checkbox {
        position: absolute;
        z-index: -1;
        opacity: 0;
    }

    .checkbox-indicator {
        position: relative;
        margin-right: 7px;
        width: 27px;
        height: 27px;
        border: 1px solid $grey300;
        transition: all 0.1s;
    }

    .checkbox-indicator::after {
        position: absolute;
        opacity: 0;
        content: '';
        top: 2px;
        left: 8px;
        width: 7px;
        height: 15px;
        transform: rotate(45deg);
        border: solid $primary;
        border-width: 0 3px 3px 0;
        transition: all 0.1s;
    }

    .checkbox-group input:checked ~ .checkbox-indicator {
        border-color: $primary;
    } 

    .checkbox-group input:checked ~ .checkbox-indicator::after {
        opacity: 1;
    }
</style>
