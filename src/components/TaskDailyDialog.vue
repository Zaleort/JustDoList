<template>
    <modal-dialog :show="show" @close="closeDialog">
        <div class="dialog-header">
            <h1 id="task-daily-heading" class="font-white dialog-title">Nueva tarea pendiente</h1>
        </div>
        <div id="task-daily-form" class="dialog-form">
            <label class="dialog-form-group">
                <p class="dialog-form-name">Tarea</p>
                <input @blur="validateTaskName"
                    @keydown.enter="submit"
                    id="task-daily-name" 
                    class="dialog-form-input" 
                    placeholder="Limpiar los platos" 
                    type="text">
            </label>

            <label class="dialog-form-group">
                <p class="dialog-form-name">Notas</p>
                <textarea id="task-daily-notes" class="dialog-form-textarea dialog-form-input" rows="4"></textarea>
            </label>

            <div class="dialog-form-group">
                <p class="dialog-form-name">Subtareas</p>
                <div class="subtask-group" v-for="subTask of currentSubTasks" :key="subTask.id">
                    <input class="dialog-form-input dialog-subtasks-list dialog-subtasks-remove" 
                        type="text"
                        :value="subTask.name"
                        ref="subTasks"
                        @blur="updateSubTaskName(subTask.id, $event)">
                    <span @click="deleteSubTask(subTask.id)" class="delete-subtask-icon">
                        <svg class="icon" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                            <path d="M0 84V56c0-13.3 10.7-24 24-24h112l9.4-18.7c4-8.2 12.3-13.3 21.4-13.3h114.3c9.1 0 17.4 5.1 21.5 13.3L312 32h112c13.3 0 24 10.7 24 24v28c0 6.6-5.4 12-12 12H12C5.4 96 0 90.6 0 84zm416 56v324c0 26.5-21.5 48-48 48H80c-26.5 0-48-21.5-48-48V140c0-6.6 5.4-12 12-12h360c6.6 0 12 5.4 12 12zm-272 68c0-8.8-7.2-16-16-16s-16 7.2-16 16v224c0 8.8 7.2 16 16 16s16-7.2 16-16V208zm96 0c0-8.8-7.2-16-16-16s-16 7.2-16 16v224c0 8.8 7.2 16 16 16s16-7.2 16-16V208zm96 0c0-8.8-7.2-16-16-16s-16 7.2-16 16v224c0 8.8 7.2 16 16 16s16-7.2 16-16V208z"></path>
                        </svg>
                    </span>
                </div>
                <div class="subtask-group">
                    <span @click="addSubTask" class="icon add-subtask-icon">
                        <svg class="icon" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                            <path fill="#4caf50" d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"></path>
                        </svg>
                    </span>
                    <input @keydown.enter="addSubTask" 
                        id="task-daily-subtask"
                        class="dialog-form-input dialog-subtasks-list dialog-subtasks-add" 
                        type="text"
                        placeholder="Añadir nueva subtarea">
                </div>
            </div>

            <div class="dialog-footer">
                <input type="hidden" id="task-daily-id" value="">
                <input @click="closeDialog" class="mr-1 cancel-button button button-alpha font-danger" type="button" value="Cancelar">
                <input @click="procesarTarea" id="task-daily-submit" class="save-button button button-success" type="submit" value="Crear tarea">
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

export default class TaskDailyDialog extends Vue {
    @Prop() private show!: boolean;

    get currentTask() {
        return this.$store.state.daily.current;
    }

    get currentSubTasks() {
        return this.$store.state.daily.current.subTasks;
    }

    get currentSubTaskIdCounter() {
        return this.$store.state.daily.current.subTaskId;
    }

    private addSubTask(): void {
        let task: ISubTask;

        this.$store.commit('daily/INCREASE_CURRENT_SUBTASK_COUNTER');
        const taskId = this.currentSubTaskIdCounter;
        const taskName = (document.getElementById('task-daily-subtask') as HTMLInputElement).value;

        if (!taskName || taskName.trim().length === 0) { return; }

        task = {
            id: taskId,
            name: taskName,
            checked: false,
        };

        this.$store.dispatch('daily/addCurrentSubTask', task);
        (document.getElementById('task-daily-subtask') as HTMLInputElement).value = '';
    }

    private deleteSubTask(id: string): void {
        this.$store.dispatch('daily/deleteCurrentSubTask', id);
    }

    private updateSubTaskName(id: string, event: any) {
        const name = event.target.value;
        this.$store.dispatch('daily/updateCurrentSubTaskName', { id, name });
    }

    private procesarTarea(): void {
        const taskId = (document.getElementById('task-daily-id') as HTMLInputElement).value;
        const taskName = (document.getElementById('task-daily-name') as HTMLInputElement).value;

        if (!this.validateTaskName()) { return; }

        const taskNotes = (document.getElementById('task-daily-notes') as HTMLInputElement).value;
        const subTasks = this.currentSubTasks;
        const lastSubTask = (document.getElementById('task-daily-subtask') as HTMLInputElement).value;

        if (lastSubTask) {
            this.$store.commit('pending/INCREASE_CURRENT_SUBTASK_COUNTER');
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
        const taskName = document.getElementById('task-daily-name') as HTMLInputElement;

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
        document.getElementById('task-daily-name')!.blur();
        document.getElementById('task-daily-submit')!.click();
    }

    private closeDialog(): void {
        this.$emit('close');
        this.$store.dispatch('daily/updateCurrent', { id: '', name: '', notes: '', subTasks: [] });
        this.resetDialog();
    }

    private resetDialog(): void {
        (document.getElementById('task-daily-id') as HTMLInputElement).value = '';

        const taskName = document.getElementById('task-daily-name') as HTMLInputElement;
        taskName.value = '';
        taskName.classList.remove('input-error');

        (document.getElementById('task-daily-notes') as HTMLInputElement).value = '';
        (document.getElementById('task-daily-subtask') as HTMLInputElement)!.value = '';
    }
}
</script>
