<template>
    <div class="card task-card" ref="task">
        <div class="card-header">
            <div class="checkbox-group">
                <button @click="completeTask" class="checkbox-button checkbox-indicator"></button>
                <p @click="openEditTask" class="checkbox-title">{{ name }}</p>
            </div>
            <span @click="toggleSubTasks" v-if="hasSubTasks" class="icon expand-icon" ref="expandIcon">
                <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                    <path d="M240.971 130.524l194.343 194.343c9.373 9.373 9.373 24.569 0 33.941l-22.667 22.667c-9.357 9.357-24.522 9.375-33.901.04L224 227.495 69.255 381.516c-9.379 9.335-24.544 9.317-33.901-.04l-22.667-22.667c-9.373-9.373-9.373-24.569 0-33.941L207.03 130.525c9.372-9.373 24.568-9.373 33.941-.001z"></path>
                </svg>
            </span>
            <span class="task-options-icon">
                <svg @click="showOptionsMenu = !showOptionsMenu" class="icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
        <div class="relative task-card-footer">
            <span v-if="dateDeadline">
                Finaliza el {{ dateDeadline }}
            </span>
            <div v-if="tags && tags.length > 0" class="task-tags-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
                    <path d="M497.941 225.941L286.059 14.059A48 48 0 0 0 252.118 0H48C21.49 0 0 21.49 0 48v204.118a48 48 0 0 0 14.059 33.941l211.882 211.882c18.744 18.745 49.136 18.746 67.882 0l204.118-204.118c18.745-18.745 18.745-49.137 0-67.882zM112 160c-26.51 0-48-21.49-48-48s21.49-48 48-48 48 21.49 48 48-21.49 48-48 48zm513.941 133.823L421.823 497.941c-18.745 18.745-49.137 18.745-67.882 0l-.36-.36L527.64 323.522c16.999-16.999 26.36-39.6 26.36-63.64s-9.362-46.641-26.36-63.64L331.397 0h48.721a48 48 0 0 1 33.941 14.059l211.882 211.882c18.745 18.745 18.745 49.137 0 67.882z"></path>
                </svg>
            </div>
            <div class="tooltip">{{ tagsTooltip }}</div>
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
    @Prop({ default: 0 }) private subTaskId!: number;
    @Prop() private tags!: string[];
    @Prop({ default: 'd1' }) private frecuency!: string;
    @Prop({ default: 0 }) private streak!: number;
    @Prop() private dateCreated!: string;
    @Prop() private dateUpdated!: string;
    @Prop() private dateDeadline!: string;
    @Prop() private dateFinalized!: string;

    private showOptionsMenu: boolean = false;

    get options() {
        let isDisabled;

        if (this.type === 'pending') {
            isDisabled = this.$store.state.pending.tasks.length <= 1;
        } else if (this.type === 'daily') {
            isDisabled = this.$store.state.daily.tasks.length <= 1;
        }

        return [
        {
            name: 'Editar',
            src: require('../assets/pen-solid.svg'),
            disabled: false,
        },
        {
            name: 'Mover arriba',
            src: require('../assets/arrow-up-solid.svg'),
            disabled: isDisabled,
        },
        {
            name: 'Mover abajo',
            src: require('../assets/arrow-down-solid.svg'),
            disabled: isDisabled,
        },
        {
            name: 'Borrar',
            src: require('../assets/trash-solid.svg'),
            disabled: false,
        },
    ];
    }

    get hasNotes(): boolean {
        if (this.notes) {
            return this.notes.length > 0 || this.notes.trim().length > 0;
        }

        return false;
    }

    get hasSubTasks(): boolean {
        return this.subTasks && this.subTasks.length > 0;
    }

    get tagsTooltip(): string {
        let tags = this.$store.state.tag.tags.filter((t: ITag) => {
            for (const id of this.tags) {
                if (t.id === id) {
                    return true;
                }
            }

            return false;
        });

        tags = tags.map((t: ITag) => t.name);
        return tags.join(', ');
    }

    private getTaskObject(): ITaskPending | ITaskDaily {
        // Se intenta evitar pasar referencias, de modo que no afecte directamente a state.task
        // causando comportamientos inesperados

        return {
            id: this.id,
            name: this.name,
            notes: this.notes,
            subTasks: JSON.parse(JSON.stringify(this.subTasks)),
            subTaskId: this.subTaskId,
            tags: this.tags.slice(),
            frecuency: this.frecuency,
        };
    }

    private completeTask(): void {
        // Mantiene el ancho del objeto al aplicar position: absolute para la animación de salida
        const width = (this.$refs.task as HTMLElement).getBoundingClientRect().width;
        (this.$refs.task as HTMLElement).style.width = width + 'px';

        this.$store.dispatch(this.type + '/completeTask', this.id);
    }

    private openEditTask(): void {
        this.$store.dispatch(this.type + '/updateCurrent', this.getTaskObject());
        this.$emit('openDialog');
    }

    private toggleSubTasks(): void {
        (this.$refs.expandIcon as HTMLElement).classList.toggle('expanded');
        (this.$refs.subTasks as HTMLElement).classList.toggle('task-subtasks-hide');
    }

    private handleOptionsMenu(payload: number): void {
        switch (payload) {
            case 0:
                this.openEditTask();
                break;
            case 1:
                this.moveTaskUp();
                break;
            case 2:
                this.moveTaskDown();
                break;
            case 3:
                this.completeTask();
                break;
        }
    }

    private moveTaskUp(): void {
        this.$store.dispatch(this.type + '/moveTaskUp', this.id);
    }

    private moveTaskDown(): void {
        this.$store.dispatch(this.type + '/moveTaskDown', this.id);
    }
}
</script>


<style lang="scss">
    @import '../scss/variables';

    .task-card {
        padding: 21px 16px;
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
        width: 28px;
        height: 28px;
        position: relative;
        margin-left: auto;
    }

    .task-options-icon svg {
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
        visibility: hidden;
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

    .task-card-footer {
        display: flex;
        flex-direction: row-reverse;
        margin-top: 12px;
    }

    .task-tags-icon {
        fill: $grey400;
        margin-right: 9px;
        width: 16px;
        height: 16px;
    }

    .task-tags-icon:hover {
        fill: $grey600;
    }

    .task-tags-icon:hover ~ .tooltip {
        visibility: visible;
    }

    .tooltip {
        visibility: hidden;
        position: absolute;
        right: 0;
        top: 21px;
        max-width: 225px;
        line-break: loose;
        word-wrap: break-word;
        background-color: rgba(0, 0, 0, 0.8);
        box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1);
        color: white;
        font-size: 0.8em;
        padding: 9px 16px;
        border-radius: 5px;
        line-height: 1.33;
    }
</style>
