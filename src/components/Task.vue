<template>
    <div class="task-card" ref="task">
        <div class="task-card-header">
            <div class="checkbox-group">
                <button @click="completeTask" class="checkbox-button checkbox-indicator"></button>
                <p @click="openEditTask" class="checkbox-title">{{ name }}</p>
            </div>
            <span @click="toggleSubTasks" v-if="hasSubTasks" class="icon expand-icon" ref="expandIcon">
                <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                <path d="M240.971 130.524l194.343 194.343c9.373 9.373 9.373 24.569 0 33.941l-22.667 22.667c-9.357 9.357-24.522 9.375-33.901.04L224 227.495 69.255 381.516c-9.379 9.335-24.544 9.317-33.901-.04l-22.667-22.667c-9.373-9.373-9.373-24.569 0-33.941L207.03 130.525c9.372-9.373 24.568-9.373 33.941-.001z"></path>
            </svg>
            </span>
            <span @click="showOptionsMenu = !showOptionsMenu" class="task-options-icon">
                <svg class="icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 0h24v24H0z" fill="none"/>
                    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                </svg>
                <context-menu 
                    @action="handleOptionsMenu"
                    @close="showOptionsMenu = false" 
                    :items="options" 
                    v-if="showOptionsMenu">
                </context-menu>
            </span>
            
            
        </div>
        <p v-if="hasNotes" class="task-notes">{{ notes }}</p>
        <div ref="subTasks" class="task-subtasks-list" v-if="hasSubTasks">
            <SubTask v-for="subTask in subTasks" :key="subTask.id" v-bind="subTask" :taskId="id" :taskType="type" />
        </div>
        <div class="task-card-footer">
            
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import SubTask from './SubTask.vue';
import ContextMenu from './ContextMenu.vue';

@Component({
    components: { SubTask, ContextMenu },
})
export default class Task extends Vue {
    @Prop() private id!: string;
    @Prop() private type!: string;
    @Prop() private name!: string;
    @Prop() private notes!: string;
    @Prop() private subTasks!: ISubTask[];
    @Prop() private tags!: object[];
    @Prop() private dateCreated!: string;
    @Prop() private dateUpdated!: string;
    @Prop() private dateDeadline!: string;
    @Prop() private dateFinalized!: string;

    private showOptionsMenu: boolean = false;
    private options = [
        {
            name: 'Editar',
            src: require('../assets/pen-solid.svg'),
        },
        {
            name: 'Borrar',
            src: require('../assets/trash-solid.svg'),
        },
    ];

    get hasNotes(): boolean {
        return this.notes.length > 0 || this.notes.trim().length > 0;
    }

    get hasSubTasks(): boolean {
        return this.subTasks && this.subTasks.length > 0;
    }

    private getTaskObject(): ITaskPending | ITaskDaily {
        // Se intenta evitar pasar referencias, de modo que no afecte directamente a state.task
        // causando comportamientos inesperados

        return {
            id: this.id,
            name: this.name,
            notes: this.notes,
            subTasks: JSON.parse(JSON.stringify(this.subTasks)),
        };
    }

    private completeTask(): void {
        // Mantiene el ancho del objeto al aplicar position: absolute para la animación de salida
        const width = (this.$refs.task as HTMLElement).getBoundingClientRect().width;
        (this.$refs.task as HTMLElement).style.width = width + 'px';

        if (this.type === 'pending') {
            this.$store.dispatch('pending/completeTask', this.id);
        } else {
            this.$store.dispatch('daily/completeTask', this.id);
        }
    }

    private openEditTask(): void {
        if (this.type === 'pending') {
            (document.getElementById('task-pending-id') as HTMLInputElement).value = this.id;
            (document.getElementById('task-pending-name') as HTMLInputElement).value = this.name;
            (document.getElementById('task-pending-notes') as HTMLInputElement).value = this.notes;
            (document.getElementById('task-pending-submit') as HTMLInputElement).value = 'Guardar';
            document.getElementById('task-pending-heading')!.innerHTML = 'Editar tarea pendiente';

            this.$store.dispatch('pending/updateCurrent', this.getTaskObject());
        } else {
            (document.getElementById('task-daily-id') as HTMLInputElement).value = this.id;
            (document.getElementById('task-daily-name') as HTMLInputElement).value = this.name;
            (document.getElementById('task-daily-notes') as HTMLInputElement).value = this.notes;
            (document.getElementById('task-daily-submit') as HTMLInputElement).value = 'Guardar';
            document.getElementById('task-daily-heading')!.innerHTML = 'Editar tarea diaria';

            this.$store.dispatch('daily/updateCurrent', this.getTaskObject());
        }

        this.$emit('openDialog');
    }

    private toggleSubTasks(): void {
        (this.$refs.expandIcon as HTMLElement).classList.toggle('expanded');
        (this.$refs.subTasks as HTMLElement).classList.toggle('task-subtasks-hide');
    }

    private handleOptionsMenu(payload: number): void {
        if (payload === 0) {
            this.openEditTask();
        } else if (payload === 1) {
            this.completeTask();
        }
    }
}
</script>


<style lang="scss">
    @import '../scss/variables';

    .task-card {
        margin-top: 1em;
        background-color: #ffffff;
        border-left: 9px solid $primary;
        padding: 21px 16px;
        box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
    }

    .task-card-header {
        display: flex;
        align-items: center;
    }

    .task-notes {
        font-size: 0.8em;
        color: $grey700;
        margin-top: 12px;
        margin-bottom: 0;
        margin-left: 36px;
    }

    .expand-icon svg {
        fill: $grey400;
        width: 18px;
        height: 18px;
    }

    .expand-icon.expanded {
        transform: rotate(180deg);
    }

    .task-options-icon {
        position: relative;
        margin-left: auto;
    }

    .task-options-icon svg {
        width: 28px;
        height: 28px;
        fill: $grey400;
    }

    .task-options-icon svg:hover, .expand-icon svg:hover {
        fill: $grey600;
    }

    .task-subtasks-list {
        opacity: 1;
        transition: all 0.2s ease-in;
    }

    .task-subtasks-hide {
        opacity: 0;
        overflow: hidden;
        height: 0;
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
        user-select: none;
        margin: 0 12px 0 7px;
        word-wrap: break-word;
        transition: all 0.1s ease;
    }

    .checkbox {
        position: absolute;
        z-index: -1;
        opacity: 0;
    }

    .checkbox-button {
        cursor: pointer;
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

    .checkbox:checked ~ .checkbox-title {
        color: $grey400;
    }
</style>
