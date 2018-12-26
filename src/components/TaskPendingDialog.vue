<template>
    <div class="dialog-container" id="task-pending-dialog">
        <div class="dialog-content">
            <div class="dialog-header">
                <h1 id="task-pending-heading" class="font-white dialog-title">Nueva tarea pendiente</h1>
            </div>
            <div id="task-pending-form" class="dialog-form">
                <div></div>
                <label class="dialog-form-group">
                    <p class="dialog-form-name">Tarea</p>
                    <input id="task-pending-name" class="dialog-form-input" placeholder="Limpiar los platos" type="text">
                </label>
                <label class="dialog-form-group">
                    <p class="dialog-form-name">Notas</p>
                    <textarea id="task-pending-notes" class="dialog-form-input" cols="30" rows="10"></textarea>
                </label>
                <label class="dialog-form-group">
                    <p class="dialog-form-name">Subtareas</p>
                    <input v-for="subTask of currentSubTasks" :key="subTask.id"
                        class="dialog-form-input pending-subtasks-list" 
                        type="text"
                        :value="subTask.name"
                        ref="subTasks"
                        @blur="updateSubTaskName(subTask.id, $event)"
                    >
                    <input @keydown.enter="addSubTask" 
                        id="task-pending-subtask"
                        class="dialog-form-input pending-subtasks-list" 
                        type="text"
                        placeholder="Añadir nueva subtarea">
                </label>
                <div class="dialog-footer">
                    <input type="hidden" id="task-pending-id" value="">
                    <input @click="closeDialog" class="mr-1 button button-alpha font-danger" type="button" value="Cancelar">
                    <input @click="procesarTarea" id="task-pending-submit" class="button button-success" type="submit" value="Crear tarea">
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class TaskPendingDialog extends Vue {
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
            // Generar y asignar ID
            // Añadir tarea
            task.id = `${this.$store.state.pending.tasks.length + 1}`;
            this.$store.dispatch('pending/addTask', task);
        } else {
            this.$store.dispatch('pending/updateTask', task);
        }

        this.closeDialog();
    }

    private closeDialog(): void {
        this.$store.dispatch('closeDialog', 'task-pending-dialog');
        this.$store.dispatch('pending/updateCurrent', { id: '', name: '', notes: '', subTasks: [] });
        this.resetDialog();
    }

    private resetDialog(): void {
        (document.getElementById('task-pending-id') as HTMLInputElement).value = '';
        (document.getElementById('task-pending-name') as HTMLInputElement).value = '';
        (document.getElementById('task-pending-notes') as HTMLInputElement).value = '';
        (document.getElementById('task-pending-subtask') as HTMLInputElement)!.value = '';
    }
}
</script>


<style lang="scss">
    @import '../scss/variables';

    .dialog-form {
        padding: 16px;
    }

    .dialog-form-group {
        display: flex;
        flex-direction: column;
        margin-bottom: 12px;
    }

    .dialog-form-name {
        font-family: $montserrat;
        margin: 7px 0;
    }

    .dialog-form-input {
        padding: 7px;
        font-family: $montserrat;
        border: 1px solid $grey300;
        border-radius: 3px;
    }

    .pending-subtasks-list {
        padding-left: 12px;
        border: none;
        border-radius: 0;
        border-bottom: 1px solid $grey300;
        background-color: #fefefe;
    }

</style>
