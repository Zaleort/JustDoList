<template>
    <modal-dialog :show="show" @close="closeDialog">
        <div class="dialog-header">
            <h1 ref="taskHeading" class="font-white dialog-title">{{ heading }}</h1>
            </div>
            <div class="dialog-form">

                <label class="dialog-form-group">
                    <p class="dialog-form-name">Tarea</p>
                    <input @blur="validateTaskName"
                        @keydown.enter="submit"
                        ref="taskName" 
                        class="text-input"
                        v-model="current.name"
                        placeholder="Limpiar los platos" 
                        type="text"
                        required>
                </label>

                <label class="dialog-form-group">
                    <p class="dialog-form-name">Notas</p>
                    <textarea ref="taskNotes" class="text-input dialog-form-textarea" rows="4" v-model="current.notes"></textarea>
                </label>

                <div class="dialog-form-group">
                    <p class="dialog-form-name">Subtareas</p>
                    <div class="relative subtask-group" v-for="(subTask, id) of current.subTasks" :key="id">
                        <span @click="deleteSubTask(id)" class="delete-subtask-icon">
                            <svg class="icon" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                <path d="M0 84V56c0-13.3 10.7-24 24-24h112l9.4-18.7c4-8.2 12.3-13.3 21.4-13.3h114.3c9.1 0 17.4 5.1 21.5 13.3L312 32h112c13.3 0 24 10.7 24 24v28c0 6.6-5.4 12-12 12H12C5.4 96 0 90.6 0 84zm416 56v324c0 26.5-21.5 48-48 48H80c-26.5 0-48-21.5-48-48V140c0-6.6 5.4-12 12-12h360c6.6 0 12 5.4 12 12zm-272 68c0-8.8-7.2-16-16-16s-16 7.2-16 16v224c0 8.8 7.2 16 16 16s16-7.2 16-16V208zm96 0c0-8.8-7.2-16-16-16s-16 7.2-16 16v224c0 8.8 7.2 16 16 16s16-7.2 16-16V208zm96 0c0-8.8-7.2-16-16-16s-16 7.2-16 16v224c0 8.8 7.2 16 16 16s16-7.2 16-16V208z"></path>
                            </svg>
                        </span>
                        <input class="text-input right-icon full-width dialog-subtasks-list" 
                            type="text"
                            :value="subTask.name"
                            @blur="updateSubTaskName(id, $event)">
                    </div>
                    <div class="relative subtask-group">
                        <span @click="addSubTask" class="text-input-icon left">
                            <svg class="icon" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                <path fill="#4caf50" d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"></path>
                            </svg>
                        </span>
                        <input @keydown.enter="addSubTask" 
                            ref="taskSubTask"
                            class="text-input left-icon full-width dialog-subtasks-list" 
                            type="text"
                            placeholder="Añadir nueva subtarea">
                    </div>
                </div>

                <label class="dialog-form-group">
                    <p class="dialog-form-name">Fecha límite</p>
                    <div class="dialog-form-pending-time-group">
                        <input v-model="deadlineDate" class="text-input" type="date" ref="dueDate">
                        <input v-model="deadlineTime" class="text-input" type="time" ref="dueTime">
                    </div>
                </label>

                <div class="dialog-form-group">
                    <p class="dialog-form-name">Etiquetas</p>
                    <div class="dialog-form-group">
                        <search-select :items="selectTags"
                            :placeholder="'Añadir etiquetas'"
                            :noResults="'Sin resultados, se creará una etiqueta nueva'"
                            @selected="addTag" 
                            @created="addNewTag"/>
                    </div>
                    <div>
                        <transition-group
                            tag="div"
                            class="tag-cloud"
                            enter-active-class="animate faster fade-in-up-slight"
                            move-class="move">
                                <tag v-for="(tag, id) in tagCloud" 
                                    :key="id"
                                    :id="id" 
                                    v-bind="tag" 
                                    :isModal="true"
                                    :type="'pending'"/>
                        </transition-group>
                    </div>
                </div>

                <div class="dialog-footer">
                    <input type="hidden" ref="taskId" v-model="currentId">
                    <input @click="closeDialog" class="mr-1 cancel-button button button-alpha font-danger" type="button" value="Cancelar">
                    <input @click="processTask" ref="taskSubmit" class="save-button button button-success" type="submit" :value="submitText">
                </div>
            </div>
    </modal-dialog>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import ModalDialog from './ModalDialog.vue';
import SearchSelect from './SearchSelect.vue';
import Tag from './Tag.vue';
import { mapState } from 'vuex';

@Component({
     components: { ModalDialog, SearchSelect, Tag },

    computed: {
        ...mapState('pending', {
            current: (state: PendingState) => state.current,
            currentId: (state: PendingState) => state.currentId,
            currentSubTasks: (state: PendingState) => state.current.subTasks,
        }),
    },
})

export default class TaskPendingDialog extends Vue {
    @Prop() private show!: boolean;
    @Prop() private heading!: string;
    @Prop() private submitText!: string;

    private current!: ITaskPending;
    private currentId!: string;

    get tagCloud(): ITags {
        if (!this.$store.state.tag) { return {}; }

        const currentTags = this.current.tags;
        if (currentTags == null) { return {}; }

        const tags: ITags = {};

        for (const id in currentTags) {
            if (this.$store.state.tag.tags[id] != null) {
                tags[id] = this.$store.state.tag.tags[id];
            }
        }

        return tags;
    }

    get selectTags(): ITags {
        if (!this.$store) { return {}; }

        const all = this.$store.state.tag.tags;
        return all;
    }

    set deadlineDate(date: string) {
        this.$store.commit('pending/SET_DEADLINE_DATE', date);
    }

    get deadlineDate(): string {
        const date = new Date(this.current.dateDeadline);

        if (date.getTime() <= 0) { return ''; }

        const dayN = date.getDate();
        const monthN = date.getMonth();
        const year = date.getFullYear();

        let month = (monthN + 1).toString();
        let day = dayN.toString();

        if (monthN + 1 < 10) {
            month = '0' + (monthN + 1);
        }

        if (dayN < 10) {
            day = '0' + dayN;
        }

        return `${year}-${month}-${day}`;
    }

    set deadlineTime(time: string) {
        this.$store.commit('pending/SET_DEADLINE_TIME', time);
    }

    get deadlineTime(): string {
        const date = new Date(this.current.dateDeadline);

        if (date.getTime() <= 0) { return ''; }

        let h = date.getHours().toString();
        let m = date.getMinutes().toString();

        if (h.length === 1) {
            h = '0' + h;
        }

        if (m.length === 1) {
            m = '0' + m;
        }

        return h + ':' + m;
    }

    private addSubTask(): void {
        const taskName = (this.$refs.taskSubTask as HTMLInputElement).value;

        if (!taskName || taskName.trim().length === 0) { return; }

        const subTask: ISubTask = {
            name: taskName,
            checked: false,
        };

        this.$store.dispatch('pending/addCurrentSubTask', subTask);
        (this.$refs.taskSubTask as HTMLInputElement).value = '';
    }

    private deleteSubTask(id: string): void {
        this.$store.dispatch('pending/deleteCurrentSubTask', id);
    }

    private updateSubTaskName(id: string, event: any): void {
        const name = event.target.value;
        this.$store.dispatch('pending/updateCurrentSubTaskName', { id, name });
    }

    private addTag(id: string): void {
        this.$store.dispatch('pending/addCurrentTag', id);
    }

    private addNewTag(name: string): void {
        const newTag = {
            name,
            color: '#7400C9',
        } as ITag;

        this.$store.dispatch('tag/addTag', newTag).then((response) => {
            this.$store.dispatch('pending/addCurrentTag', response.id);
        });
    }

    private processTask(): void {
        if (!this.validateTaskName()) { return; }

        const lastSubTask = (this.$refs.taskSubTask as HTMLInputElement).value;

        if (lastSubTask) {
            const subTask = {
                name: lastSubTask,
                checked: false,
            };

            this.$store.dispatch('pending/addCurrentSubTask', subTask);
        }

        if (!this.currentId || this.currentId.length <= 0) {
            this.$store.dispatch('pending/addTask', this.current);
        } else {
            this.$store.dispatch('pending/updateTask',  {id: this.currentId, task: this.current});
        }

        this.closeDialog();
    }

    private validateTaskName(): boolean {
        const taskName = this.$refs.taskName as HTMLInputElement;

        if (!taskName.value || taskName.value.trim().length === 0) {
            taskName.classList.add('input-error');
            return false;
        }

        taskName.classList.remove('input-error');
        return true;
    }

    // Evita que se muestre el outline de error, forzando el blur antes que
    // processTask
    private submit() {
        (this.$refs.taskName as HTMLInputElement).blur();
        (this.$refs.taskSubmit as HTMLElement).click();
    }

    private closeDialog(): void {
        this.$emit('close');
        this.$store.commit('pending/RESET_CURRENT_TASK');
        this.resetDialog();
    }

    private resetDialog(): void {
        (this.$refs.taskId as HTMLInputElement).value = '';

        const taskName = this.$refs.taskName as HTMLInputElement;
        taskName.value = '';
        taskName.classList.remove('input-error');

        (this.$refs.taskNotes as HTMLInputElement).value = '';
        (this.$refs.taskSubTask as HTMLInputElement)!.value = '';
    }
}
</script>
