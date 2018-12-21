<template>
    <div class="task-card">
        <div class="task-card-header">
            <div class="checkbox-group">
                <button class="checkbox-button checkbox-indicator"></button>
                <p @click="openEditTarea" class="checkbox-title">{{ name }}</p>
            </div>
            <svg v-if="hasSubTasks" class="icon expand-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                <path d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z"></path>
            </svg>
            <svg class="icon task-options-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 0h24v24H0z" fill="none"/>
                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
        </div>
        <div v-if="hasSubTasks">
            <label v-for="subTask of subTasks" :key="subTask.id" class="checkbox-group--sm">
                <input class="checkbox" type="checkbox" name="" id="" :checked="subTask.checked">
                <div class="checkbox-indicator--sm"></div>
                <p class="checkbox-title">{{ subTask.name }}</p>
            </label>
        </div>
        <div class="task-card-footer">
            
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import '../interfaces/ISubTask';

@Component
export default class TasksList extends Vue {
    @Prop()
    private id!: string;

    @Prop({ default: 'Tarea 1' })
    private name!: string;

    @Prop()
    private subTasks!: ISubTask[];

    @Prop()
    private tags!: object[];

    @Prop()
    private dateCreation!: string;

    @Prop()
    private dateUpdated!: string;

    @Prop()
    private dateDeadline!: string;

    @Prop()
    private dateFinalized!: string;

    get hasSubTasks() {
        return this.subTasks && this.subTasks.length > 0;
    }

    private openEditTarea(): void {
        (document.getElementById('tarea-pendiente-id') as HTMLInputElement).value = this.id;
        (document.getElementById('tarea-pendiente-titulo') as HTMLInputElement).value = this.name;
        (document.getElementById('tarea-pendiente-subtarea') as HTMLInputElement).value = this.subTasks[0].name;

        this.$store.dispatch('openDialog', 'tarea-pendiente-dialog');
    }
}
</script>


<style lang="scss">
    @import '../scss/variables';

    .task-card {
        margin-top: 12px;
        background-color: #ffffff;
        border-left: 9px solid $primary;
        padding: 21px 16px;
        box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
    }

    .task-card-header {
        display: flex;
        align-items: center;
    }

    .expand-icon {
        fill: $grey400;
        min-width: 18px;
        min-height: 18px;
    }

    .expand-icon.expanded {
        transform: rotate(180deg);
    }

    .task-options-icon {
        min-width: 28px;
        min-height: 28px;
        fill: $grey400;
        margin-left: auto;
    }

    .checkbox-group, .checkbox-group--sm {
        display: flex;
        align-items: center;
        cursor: pointer;
    }

    .checkbox-group--sm {
        margin-top: 12px;
        margin-left: 36px;
        font-size: 0.9em;
    }

    .checkbox-title {
        font-family: $montserrat;
        margin: 0 12px 0 7px;
        word-wrap: break-word;
    }

    .checkbox {
        position: absolute;
        z-index: -1;
        opacity: 0;
    }

    .checkbox-button {
        padding: 0;
        background-color: #fff;

    }

    .checkbox-indicator, .checkbox-indicator--sm {
        position: relative;
        border: 1px solid $grey300;
        transition: all 0.1s;
    }

    .checkbox-indicator {
        min-width: 27px;
        min-height: 27px;
    }

    .checkbox-indicator--sm {
        min-width: 18px;
        min-height: 18px;
    }

    .checkbox-indicator::after, .checkbox-indicator--sm::after {
        position: absolute;
        opacity: 0;
        content: '';
        transform: rotate(45deg);
        border: solid $primary;
        transition: all 0.1s;
    }

    .checkbox-indicator::after {
        top: 2px;
        left: 8px;
        width: 7px;
        height: 15px;
        border-width: 0 3px 3px 0;
    }

    .checkbox-indicator--sm::after {
        top: 1px;
        left: 4px;
        width: 5px;
        height: 10px;
        border-width: 0 2px 2px 0;
    }

    .checkbox:checked ~ .checkbox-indicator, .checkbox:checked ~ .checkbox-indicator--sm {
        border-color: $primary;
    } 

    .checkbox:checked ~ .checkbox-indicator::after, .checkbox:checked ~ .checkbox-indicator--sm::after {
        opacity: 1;
    }
</style>
