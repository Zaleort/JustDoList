<template>
    <modal-dialog :show="show" @close="closeDialog">
        <div class="dialog-header">
            <h1 ref="taskHeading" class="font-white dialog-title">{{ heading }}</h1>
        </div>
        <div id="task-daily-form" class="dialog-form">
            <label class="dialog-form-group">
                <p class="dialog-form-name">Tarea</p>
                <input @blur="validateTaskName"
                    @keydown.enter="submit"
                    ref="taskName" 
                    class="text-input"
                    v-model="currentTask.name"
                    placeholder="Limpiar los platos" 
                    type="text">
            </label>

            <label class="dialog-form-group">
                <p class="dialog-form-name">Notas</p>
                <textarea ref="taskNotes" class="dialog-form-textarea text-input" rows="4" v-model="currentTask.notes"></textarea>
            </label>

            <div class="dialog-form-group">
                <p class="dialog-form-name">Subtareas</p>
                <div class="relative subtask-group" v-for="subTask of currentSubTasks" :key="subTask.id">
                    <span @click="deleteSubTask(subTask.id)" class="delete-subtask-icon">
                        <svg class="icon" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                            <path d="M0 84V56c0-13.3 10.7-24 24-24h112l9.4-18.7c4-8.2 12.3-13.3 21.4-13.3h114.3c9.1 0 17.4 5.1 21.5 13.3L312 32h112c13.3 0 24 10.7 24 24v28c0 6.6-5.4 12-12 12H12C5.4 96 0 90.6 0 84zm416 56v324c0 26.5-21.5 48-48 48H80c-26.5 0-48-21.5-48-48V140c0-6.6 5.4-12 12-12h360c6.6 0 12 5.4 12 12zm-272 68c0-8.8-7.2-16-16-16s-16 7.2-16 16v224c0 8.8 7.2 16 16 16s16-7.2 16-16V208zm96 0c0-8.8-7.2-16-16-16s-16 7.2-16 16v224c0 8.8 7.2 16 16 16s16-7.2 16-16V208zm96 0c0-8.8-7.2-16-16-16s-16 7.2-16 16v224c0 8.8 7.2 16 16 16s16-7.2 16-16V208z"></path>
                        </svg>
                    </span>
                    <input class="text-input right-icon full-width dialog-subtasks-list" 
                        type="text"
                        :value="subTask.name"
                        ref="subTasks"
                        @blur="updateSubTaskName(subTask.id, $event)">
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
                            <tag v-for="tag in currentTagCloud" 
                                :key="tag.id" 
                                v-bind="tag"
                                :isModal="true"
                                :type="'daily'" />
                    </transition-group>
                </div>
            </div>

            <div class="dialog-footer">
                <input type="hidden" ref="taskId" :value="currentTask.id">
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

@Component({
    components: { ModalDialog, SearchSelect, Tag },
})

export default class TaskDailyDialog extends Vue {
    @Prop() private show!: boolean;
    @Prop() private heading!: string;
    @Prop() private submitText!: string;

    get currentTask() {
        return this.$store.state.daily.current;
    }

    get currentSubTasks() {
        return this.$store.state.daily.current.subTasks;
    }

    get currentSubTaskIdCounter() {
        return this.$store.state.daily.current.subTaskId;
    }

    get currentTags() {
         return this.$store.state.daily.current.tags;
    }

    get currentTagCloud() {
        const ids = this.$store.state.daily.current.tags;
        const tags = this.$store.state.tag.tags.filter((t: ITag) => {
            for (const id of ids) {
                if (id === t.id) {
                    return true;
                }

                continue;
            }

            return false;
        });

        return tags;
    }

    get selectTags() {
        const all = this.$store.state.tag.tags.slice();
        return all;
    }

    private addSubTask(): void {
        let task: ISubTask;

        this.$store.commit('daily/INCREASE_CURRENT_SUBTASK_COUNTER');
        const taskId = this.currentSubTaskIdCounter;
        const taskName = (this.$refs.taskSubTask as HTMLInputElement).value;

        if (!taskName || taskName.trim().length === 0) { return; }

        task = {
            id: taskId,
            name: taskName,
            checked: false,
        };

        this.$store.dispatch('daily/addCurrentSubTask', task);
        (this.$refs.taskSubTask as HTMLInputElement).value = '';
    }

    private deleteSubTask(id: string): void {
        this.$store.dispatch('daily/deleteCurrentSubTask', id);
    }

    private updateSubTaskName(id: string, event: any) {
        const name = event.target.value;
        this.$store.dispatch('daily/updateCurrentSubTaskName', { id, name });
    }

    private addTag(id: string): void {
        this.$store.dispatch('daily/addCurrentTag', id);
    }

    private addNewTag(name: string): void {
        this.$store.commit('tag/INCREASE_ID_COUNTER');
        const tagId = this.$store.state.tag.idCounter;

        const newTag = {
            id: tagId,
            name,
            color: '#7400C9',
        } as ITag;

        this.$store.dispatch('tag/addTag', newTag);
        this.$store.dispatch('daily/addCurrentTag', tagId);
    }

    private processTask(): void {
        const taskId = (this.$refs.taskId as HTMLInputElement).value;
        const taskName = (this.$refs.taskName as HTMLInputElement).value;

        if (!this.validateTaskName()) { return; }

        const taskNotes = (this.$refs.taskNotes as HTMLInputElement).value;
        const subTasks = this.currentSubTasks;
        const lastSubTask = (this.$refs.taskSubTask as HTMLInputElement).value;
        const tags = this.currentTags;

        if (lastSubTask) {
            this.$store.commit('daily/INCREASE_CURRENT_SUBTASK_COUNTER');
            const subTask = {
                id: this.currentSubTaskIdCounter,
                name: lastSubTask,
                checked: false,
            };

            this.$store.dispatch('daily/addCurrentSubTask', subTask);
        }

        const task: ITaskDaily = {
            id: taskId,
            name: taskName,
            notes: taskNotes,
            subTasks,
            subTaskId: this.currentSubTaskIdCounter,
            tags,
        };

        if (!task.id) {
            // Generar y asignar ID
            // Añadir tarea
            this.$store.commit('daily/INCREASE_ID_COUNTER');
            task.id = this.$store.state.daily.idCounter;
            this.$store.dispatch('daily/addTask', task);
        } else {
            this.$store.dispatch('daily/updateTask', task);
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
        this.$store.dispatch('daily/updateCurrent',
            {
                id: '',
                name: '',
                notes: '',
                subTasks: [],
                subTaskId: 0,
                tags: [],
            });
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
