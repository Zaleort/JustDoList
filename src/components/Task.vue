<template>
    <div class="card task-card" :class="borderColor" ref="task">
        <div class="card-header">
            <div class="checkbox-group">
                <button aria-label="boton-completar-tarea" @click="completeTask" class="checkbox-button checkbox-indicator" :class="[checked, borderColor]"></button>
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
            <SubTask v-for="(subTask, key) in subTasks" 
                :key="key" 
                :id="key" 
                v-bind="subTask" 
                :taskId="id" 
                :taskType="type"
                :taskColor="borderColor" />
        </div>
        <div class="relative task-card-footer">
            <div class="task-calendar-icon" v-if="dateDeadline">
                <svg :class="{ 'icon-danger': deadlineSoon }" ref="calendarIcon" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                    <path d="M12 192h424c6.6 0 12 5.4 12 12v260c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V204c0-6.6 5.4-12 12-12zm436-44v-36c0-26.5-21.5-48-48-48h-48V12c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v52H160V12c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v52H48C21.5 64 0 85.5 0 112v36c0 6.6 5.4 12 12 12h424c6.6 0 12-5.4 12-12z"></path>
                </svg>
            </div>
            <div class="tooltip roboto">{{ deadlineMessage }}</div>
            <div v-if="streak >= 0" class="task-streak-icon">
                <span>{{ streak }}</span>
                <svg aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path d="M500.33 0h-47.41a12 12 0 0 0-12 12.57l4 82.76A247.42 247.42 0 0 0 256 8C119.34 8 7.9 119.53 8 256.19 8.1 393.07 119.1 504 256 504a247.1 247.1 0 0 0 166.18-63.91 12 12 0 0 0 .48-17.43l-34-34a12 12 0 0 0-16.38-.55A176 176 0 1 1 402.1 157.8l-101.53-4.87a12 12 0 0 0-12.57 12v47.41a12 12 0 0 0 12 12h200.33a12 12 0 0 0 12-12V12a12 12 0 0 0-12-12z"></path>
                </svg>
            </div>
            <div class="tooltip">Racha</div>
            <div v-if="tags && Object.keys(tags).length > 0" class="task-tags-icon">
                <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
                    <path d="M497.941 225.941L286.059 14.059A48 48 0 0 0 252.118 0H48C21.49 0 0 21.49 0 48v204.118a48 48 0 0 0 14.059 33.941l211.882 211.882c18.744 18.745 49.136 18.746 67.882 0l204.118-204.118c18.745-18.745 18.745-49.137 0-67.882zM112 160c-26.51 0-48-21.49-48-48s21.49-48 48-48 48 21.49 48 48-21.49 48-48 48zm513.941 133.823L421.823 497.941c-18.745 18.745-49.137 18.745-67.882 0l-.36-.36L527.64 323.522c16.999-16.999 26.36-39.6 26.36-63.64s-9.362-46.641-26.36-63.64L331.397 0h48.721a48 48 0 0 1 33.941 14.059l211.882 211.882c18.745 18.745 18.745 49.137 0 67.882z"></path>
                </svg>
            </div>
            <div class="tooltip">{{ 'Etiquetas: ' + tagsTooltip }}</div>
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
    @Prop({default() {
        return {};
    }}) private subTasks!: ISubTasks;
    @Prop({default() {
        return {};
    }}) private tags!: ITags;
    @Prop() private favoriteTag!: string;

    @Prop() private frecuency!: string;
    @Prop() private streak!: number;

    @Prop() private dateCreated!: number;
    @Prop() private dateUpdated!: number;
    @Prop() private dateCompleted!: number;
    @Prop() private dateLastCompleted!: number;
    @Prop() private dateDeadline!: number;

    @Prop({ default: false }) private completed!: boolean;
    private showOptionsMenu: boolean = false;

    get options() {
        return [
            {
                name: 'Editar',
                src: require('../assets/pen-solid.svg'),
                disabled: false,
            },
            {
                name: 'Borrar',
                src: require('../assets/trash-solid.svg'),
                disabled: false,
            },
        ];
    }

    get borderColor(): string {
        if (!this.$store.state.tag.tags[this.favoriteTag]) { return 'border-purple'; }

        return 'border-' + this.$store.state.tag.tags[this.favoriteTag].color;
    }

    get checked(): string {
        if (this.completed) { return 'checked'; }
        return '';
    }

    get hasNotes(): boolean {
        if (this.notes) {
            return this.notes.length > 0 || this.notes.trim().length > 0;
        }

        return false;
    }

    get hasSubTasks(): boolean {
        return this.subTasks && Object.keys(this.subTasks).length > 0;
    }

    get tagsTooltip(): string {
        if (!this.$store.state.tag.tags) { return ''; }
        if (this.tags == null) { return ''; }

        const tags: string[] = [];

        for (const id in this.$store.state.tag.tags) {
            if (this.tags[id]) {
                tags.push(this.$store.state.tag.tags[id].name);
            }
        }

        return tags.join(', ');
    }

    get deadlineMessage(): string {
        if (this.dateDeadline == null || this.dateDeadline === 0) { return ''; }

        const date = new Date(this.dateDeadline);
        const today = new Date();
        const day = date.getDate();
        const month = date.getMonth();
        const year = date.getFullYear();

        let h = date.getHours().toString();
        let m = date.getMinutes().toString();

        if (h.length === 1) {
            h = '0' + h;
        }

        if (m.length === 1) {
            m = '0' + m;
        }

        if (date.getTime() - today.getTime() < 0) {
            return `Finalizó el ${day}/${month + 1}/${year} a las ${h}:${m}`;
        }

        return `Finaliza el ${day}/${month + 1}/${year} a las ${h}:${m}`;
    }

    get deadlineSoon(): boolean {
        if (this.dateDeadline == null || this.dateDeadline === 0) { return false; }

        const due = this.dateDeadline;
        const today = new Date();

        return (due - today.getTime()) < 8.64e7;
    }

    private mounted(): void {
        this.refreshTask();
        this.checkDueDate();
    }

    private completeTask(): void {
        // Mantiene el ancho del objeto al aplicar position: absolute para la animación de salida
        if (this.type === 'pending') {
            const width = (this.$refs.task as HTMLElement).getBoundingClientRect().width;
            (this.$refs.task as HTMLElement).style.width = width + 'px';
        }

        this.$store.dispatch(this.type + '/completeTask', this.id);
    }

    private deleteTask(): void {
        const width = (this.$refs.task as HTMLElement).getBoundingClientRect().width;
        (this.$refs.task as HTMLElement).style.width = width + 'px';

        this.$store.dispatch(this.type + '/deleteTask', this.id);
    }

    private refreshTask(): void {
        if (this.type !== 'daily') { return; }
        if (this.dateCompleted == null || this.dateCompleted === 0) { return; }

        const frecuency = this.frecuency.charAt(0);
        const fNumber = parseInt(this.frecuency.substring(1, this.frecuency.length), 10);

        const today = new Date();
        const created = new Date(this.dateCreated);
        const completed = new Date(this.dateCompleted);
        today.setHours(0, 0, 0, 0);
        created.setHours(0, 0, 0, 0);
        completed.setHours(0, 0, 0, 0);

        const diffCreated = Math.floor(Math.abs((today.getTime() - created.getTime()) / 8.64e7));
        const diffCompleted = Math.floor(Math.abs((today.getTime() - completed.getTime()) / 8.64e7));

        if (this.shouldResetStreak(frecuency, fNumber, diffCompleted)) {
            this.$store.dispatch('daily/resetStreak', this.id);
        }

        if (this.shouldRefreshTask(frecuency, fNumber, diffCreated, diffCompleted)) {
            this.$store.dispatch('daily/refreshTask', this.id);
        }
    }

    private shouldResetStreak(f: string, n: number, dif: number): boolean {
        if (dif === 0) { return false; }
        switch (f) {
            case 'd': {
                return dif >= n;
            }

            case 'w': {
                return dif >= (n * 7);
            }

            default: {
                return false;
            }
        }
    }

    private shouldRefreshTask(f: string, n: number, dif: number, difCompleted: number): boolean {
        if (dif === 0 || difCompleted === 0) { return false; }
        if (!this.completed) { return false; }

        switch (f) {
            case 'd': {
                if (dif % n === 0 && difCompleted >= 1) {
                    return true;
                } else if (difCompleted >= n) {
                    return true;
                } else {
                    return false;
                }
            }

            case 'w': {
                if (dif % (n * 7) === 0 && difCompleted >= 1) {
                    return true;
                } else if (difCompleted >= (n * 7)) {
                    return true;
                } else {
                    return false;
                }
            }

            default: {
                return false;
            }
        }
    }

    private checkDueDate() {
        if (this.dateDeadline == null || this.dateDeadline === 0) { return; }

        const due = this.dateDeadline;
        const today = new Date();

        if ((due - today.getTime()) < 8.64e7) {
            (this.$refs.calendarIcon as HTMLElement).classList.add('icon-danger');
        }
    }

    private openEditTask(): void {
        this.$store.dispatch(this.type + '/updateCurrent', this.id);
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
                this.deleteTask();
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
        display: flex;
        flex-direction: column;
        padding: 21px 16px;
    }

    .task-notes {
        font-size: 0.8em;
        word-wrap: break-word;
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

    .checkbox-button:focus {
        outline: none;
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
        border-style: solid;
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

    .checkbox:checked ~ .checkbox-indicator::after, .checkbox:checked ~ .checkbox-indicator--sm::after, 
    .checked.checkbox-indicator::after, .checked.checkbox-indicator--sm::after {
        opacity: 1;
    }

    .checkbox:checked ~ .checkbox-title {
        color: $grey400;
    }

    .task-card-footer, .task-completed-card-footer {
        display: flex;
        flex-direction: row-reverse;
        margin-top: 16px;
    }

    .task-full-date {
        font-size: 0.85em;
        color: $grey500;
        margin-right: 7px;
    }

    .task-streak-icon {
        display: flex;
        flex-direction: row-reverse;
        justify-content: center;
        align-items: center;

        svg {
            fill: $grey400;
            margin-right: 3px;
            width: 14px;
            height: 14px;
        }

        span {
            color: $grey400;
            margin-right: 9px;
        }
    }

    .task-streak-icon:hover {
        svg { fill: $grey600; }
        span { color: $grey600; }
    }

    .task-streak-icon:hover + .tooltip {
        visibility: visible;
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

    .task-tags-icon:hover + .tooltip {
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

    .task-calendar-icon {
        fill: $grey400;
        margin-right: 9px;
        width: 14px;
        height: 14px;
    }

    .task-calendar-icon:hover {
        fill: $grey600;
    }

    .task-calendar-icon:hover + .tooltip {
        visibility: visible;
    }

    @media only screen and (min-width: $laptop) {
        .task-completed-card-footer {
            margin-top: auto;
        }
    }
</style>
