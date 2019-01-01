<template>
    <modal-dialog :show="show" @close="closeDialog">
        <div class="dialog-header">
            <h1 id="task-pending-heading" class="font-white dialog-title">Nueva tarea pendiente</h1>
            </div>
            <div id="task-pending-form" class="dialog-form">
                <label class="dialog-form-group">
                    <p class="dialog-form-name">Tarea</p>
                    <input @blur="validateTaskName" id="task-pending-name" class="dialog-form-input" placeholder="Limpiar los platos" type="text">
                </label>
                <label class="dialog-form-group">
                    <p class="dialog-form-name">Notas</p>
                    <textarea id="task-pending-notes" class="dialog-form-input dialog-form-textarea" rows="4"></textarea>
                </label>
                <label class="dialog-form-group">
                    <p class="dialog-form-name">Subtareas</p>
                    <input v-for="subTask of currentSubTasks" :key="subTask.id"
                        class="dialog-form-input dialog-subtasks-list" 
                        type="text"
                        :value="subTask.name"
                        ref="subTasks"
                        @blur="updateSubTaskName(subTask.id, $event)"
                    >
                    <input @keydown.enter="addSubTask" 
                        id="task-pending-subtask"
                        class="dialog-form-input dialog-subtasks-list" 
                        type="text"
                        placeholder="Añadir nueva subtarea">
                </label>
                <label class="dialog-form-group">
                    <p class="dialog-form-name">Fecha límite</p>
                </label>
                <label class="dialog-form-group">
                    <p class="dialog-form-name">Etiquetas</p>
                </label>
                <div class="dialog-footer">
                    <input type="hidden" id="task-pending-id" value="">
                    <input @click="closeDialog" class="mr-1 cancel-button button button-alpha font-danger" type="button" value="Cancelar">
                    <input @click="procesarTarea" id="task-pending-submit" class="save-button button button-success" type="submit" value="Crear tarea">
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

    get currentTask() {
        return this.$store.state.pending.current;
    }

    get currentSubTasks() {
        return this.$store.state.pending.current.subTasks;
    }

    private addSubTask(): void {
        let task: ISubTask;

        const taskId = `${this.currentSubTasks.length}`;
        const taskName = (document.getElementById('task-pending-subtask') as HTMLInputElement).value;

        if (!taskName || taskName.trim().length === 0) { return; }

        task = {
            id: taskId,
            name: taskName,
            checked: false,
        };

        this.$store.dispatch('pending/addCurrentSubTask', task);
        (document.getElementById('task-pending-subtask') as HTMLInputElement).value = '';
    }

    private updateSubTaskName(id: string, event: any) {
        const name = event.target.value;
        this.$store.dispatch('pending/updateCurrentSubTaskName', { id, name });
    }

    private procesarTarea(): void {
        const taskId = (document.getElementById('task-pending-id') as HTMLInputElement).value;
        const taskName = (document.getElementById('task-pending-name') as HTMLInputElement).value;

        if (!this.validateTaskName()) { return; }

        const taskNotes = (document.getElementById('task-pending-notes') as HTMLInputElement).value;
        const subTasks = this.currentSubTasks;
        const lastSubTask = (document.getElementById('task-pending-subtask') as HTMLInputElement).value;

        if (lastSubTask) {
            // @TODO Encontrar una mejor forma de generar ids
            const subTask = {
                id: this.currentSubTasks.length,
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
        };

        if (!task.id) {
            this.$store.commit('pending/updateCounter');
            task.id = this.$store.state.pending.idCounter;
            this.$store.dispatch('pending/addTask', task);
        } else {
            this.$store.dispatch('pending/updateTask', task);
        }

        this.closeDialog();
    }

    private validateTaskName(): boolean {
        const taskName = document.getElementById('task-pending-name') as HTMLInputElement;

        if (!taskName.value || taskName.value.trim().length === 0) {
            taskName.classList.add('input-error');
            return false;
        }

        taskName.classList.remove('input-error');
        return true;
    }

    private closeDialog(): void {
        this.$emit('close');
        this.$store.dispatch('pending/updateCurrent', { id: '', name: '', notes: '', subTasks: [] });
        this.resetDialog();
    }

    private resetDialog(): void {
        (document.getElementById('task-pending-id') as HTMLInputElement).value = '';

        const taskName = document.getElementById('task-pending-name') as HTMLInputElement;
        taskName.value = '';
        taskName.classList.remove('input-error');

        (document.getElementById('task-pending-notes') as HTMLInputElement).value = '';
        (document.getElementById('task-pending-subtask') as HTMLInputElement)!.value = '';
    }
}
</script>
