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
                        v-model="currentTask.name"
                        placeholder="Limpiar los platos" 
                        type="text"
                        required>
                </label>

                <label class="dialog-form-group">
                    <p class="dialog-form-name">Notas</p>
                    <textarea ref="taskNotes" class="text-input dialog-form-textarea" rows="4" v-model="currentTask.notes"></textarea>
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

                <label class="dialog-form-group">
                    <p class="dialog-form-name">Fecha límite</p>
                </label>

                <label class="dialog-form-group">
                    <p class="dialog-form-name">Etiquetas</p>
                </label>

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

@Component({
     components: { ModalDialog },
})

export default class TaskPendingDialog extends Vue {
    @Prop() private show!: boolean;
    @Prop() private heading!: string;
    @Prop() private submitText!: string;

    get currentTask() {
        if (this.$store) {
            return this.$store.state.pending.current;
        }

        return null;
    }

    get currentSubTasks() {
        if (this.$store) {
            return this.$store.state.pending.current.subTasks;
        }

        return null;
    }

    get currentSubTaskIdCounter() {
        if (this.$store) {
            return this.$store.state.pending.current.subTaskId;
        }

        return null;
    }

    private addSubTask(): void {
        let task: ISubTask;

        this.$store.commit('pending/INCREASE_CURRENT_SUBTASK_COUNTER');
        const taskId = this.currentSubTaskIdCounter;
        const taskName = (this.$refs.taskSubTask as HTMLInputElement).value;

        if (!taskName || taskName.trim().length === 0) { return; }

        task = {
            id: taskId,
            name: taskName,
            checked: false,
        };

        this.$store.dispatch('pending/addCurrentSubTask', task);
        (this.$refs.taskSubTask as HTMLInputElement).value = '';
    }

    private deleteSubTask(id: string): void {
        this.$store.dispatch('pending/deleteCurrentSubTask', id);
    }

    private updateSubTaskName(id: string, event: any) {
        const name = event.target.value;
        this.$store.dispatch('pending/updateCurrentSubTaskName', { id, name });
    }

    private processTask(): void {
        const taskId = (this.$refs.taskId as HTMLInputElement).value;
        const taskName = (this.$refs.taskName as HTMLInputElement).value;

        if (!this.validateTaskName()) { return; }

        const taskNotes = (this.$refs.taskNotes as HTMLInputElement).value;
        const subTasks = this.currentSubTasks;
        const lastSubTask = (this.$refs.taskSubTask as HTMLInputElement).value;

        if (lastSubTask) {
            this.$store.commit('pending/INCREASE_CURRENT_SUBTASK_COUNTER');
            const subTask = {
                id: this.currentSubTaskIdCounter,
                name: lastSubTask,
                checked: false,
            };

            this.$store.dispatch('pending/addCurrentSubTask', subTask);
        }

        const task: ITaskPending = {
            id: taskId,
            name: taskName,
            notes: taskNotes,
            subTasks,
            subTaskId: this.currentSubTaskIdCounter,
        };

        if (!task.id) {
            this.$store.commit('pending/INCREASE_ID_COUNTER');
            task.id = this.$store.state.pending.idCounter;
            this.$store.dispatch('pending/addTask', task);
        } else {
            this.$store.dispatch('pending/updateTask', task);
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
        this.$store.dispatch('pending/updateCurrent', { id: '', name: '', notes: '', subTasks: [], subTaskId: 0 });
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
