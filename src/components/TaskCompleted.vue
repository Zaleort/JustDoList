<template>
    <div class="card task-card" ref="task">
        <div class="card-header">
            <div class="checkbox-group">
                <button @click="completeTask" class="checkbox-button checkbox-indicator" :class="{ checked: completed }"></button>
                <p class="checkbox-title">{{ name }}</p>
            </div>
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
        <div class="task-card-footer">
            <span class="roboto task-completed-full-date" v-if="dateCompleted">
                {{ fullDate }}
            </span>
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
export default class TaskCompleted extends Vue {
    @Prop() private id!: string;
    @Prop() private name!: string;
    @Prop() private notes!: string;
    @Prop({default() {
        return {};
    }}) private subTasks!: ISubTasks;
    @Prop({default() {
        return {};
    }}) private tags!: any;

    @Prop() private dateCreated!: number;
    @Prop() private dateUpdated!: number;
    @Prop() private dateCompleted!: number;
    @Prop() private dateDeadline!: number;

    @Prop({ default: false })private completed!: boolean;
    private showOptionsMenu: boolean = false;

    get fullDate(): string {
        const date = new Date(this.dateCompleted);
        const day = date.getDate();
        const month = date.getMonth();
        const year = date.getFullYear();

        return `${day}/${month + 1}/${year}`;
    }

    get options() {
        return [
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

    private completeTask(): void {
        this.$store.dispatch('pending/completeTask', this.id);
    }

    private deleteTask(): void {
        const width = (this.$refs.task as HTMLElement).getBoundingClientRect().width;
        (this.$refs.task as HTMLElement).style.width = width + 'px';

        this.$store.dispatch('pending/deleteTask', this.id);
    }

    private toggleSubTasks(): void {
        (this.$refs.expandIcon as HTMLElement).classList.toggle('expanded');
        (this.$refs.subTasks as HTMLElement).classList.toggle('task-subtasks-hide');
    }

    private handleOptionsMenu(payload: number): void {
        switch (payload) {
            case 0:
                this.deleteTask();
                break;
        }
    }
}
</script>

<style lang="scss">
@import '../scss/variables';

.task-completed-full-date {
    color: $grey500;
    margin-right: 7px;
}
</style>

