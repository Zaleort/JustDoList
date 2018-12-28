<template>
    <div class="dialog-container" id="task-daily-dialog">
        <div class="dialog-content">
            <div class="dialog-header">
                <h1 id="task-daily-heading" class="font-white dialog-title">Nueva tarea pendiente</h1>
            </div>
            <div id="task-daily-form" class="dialog-form">
                <div></div>
                <label class="dialog-form-group">
                    <p class="dialog-form-name">Tarea</p>
                    <input id="task-daily-name" class="dialog-form-input" placeholder="Limpiar los platos" type="text">
                </label>
                <label class="dialog-form-group">
                    <p class="dialog-form-name">Notas</p>
                    <textarea id="task-daily-notes" class="dialog-form-input" cols="30" rows="10"></textarea>
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
                        id="task-daily-subtask"
                        class="dialog-form-input dialog-subtasks-list" 
                        type="text"
                        placeholder="Añadir nueva subtarea">
                </label>
                <div class="dialog-footer">
                    <input type="hidden" id="task-daily-id" value="">
                    <input @click="closeDialog" class="mr-1 button button-alpha font-danger" type="button" value="Cancelar">
                    <input @click="procesarTarea" id="task-daily-submit" class="button button-success" type="submit" value="Crear tarea">
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class TaskDailyDialog extends Vue {
    get currentTask() {
        return this.$store.state.daily.current;
    }

    get currentSubTasks() {
        return this.$store.state.daily.current.subTasks;
    }

    private addSubTask(): void {
        let task: ISubTask;

        const taskId = `${this.currentSubTasks.length}`;
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

    private updateSubTaskName(id: string, event: any) {
        const name = event.target.value;
        this.$store.dispatch('daily/updateCurrentSubTaskName', { id, name });
    }

    private procesarTarea(): void {
        const taskId = (document.getElementById('task-daily-id') as HTMLInputElement).value;
        const taskName = (document.getElementById('task-daily-name') as HTMLInputElement).value;
        const taskNotes = (document.getElementById('task-daily-notes') as HTMLInputElement).value;
        const subTasks = this.currentSubTasks;
        const lastSubTask = (document.getElementById('task-daily-subtask') as HTMLInputElement).value;

        if (lastSubTask) {
            // @TODO Encontrar una mejor forma de generar ids
            const subTask = {
                id: this.currentSubTasks.length,
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
        };

        if (!task.id) {
            // Generar y asignar ID
            // Añadir tarea
            task.id = `${this.$store.state.daily.tasks.length + 1}`;
            this.$store.dispatch('daily/addTask', task);
        } else {
            this.$store.dispatch('daily/updateTask', task);
        }

        this.closeDialog();
    }

    private closeDialog(): void {
        this.$store.dispatch('closeDialog', 'task-daily-dialog');
        this.$store.dispatch('daily/updateCurrent', { id: '', name: '', notes: '', subTasks: [] });
        this.resetDialog();
    }

    private resetDialog(): void {
        (document.getElementById('task-daily-id') as HTMLInputElement).value = '';
        (document.getElementById('task-daily-name') as HTMLInputElement).value = '';
        (document.getElementById('task-daily-notes') as HTMLInputElement).value = '';
        (document.getElementById('task-daily-subtask') as HTMLInputElement)!.value = '';
    }
}
</script>


<style lang="scss">
    @import '../scss/variables';
    .daily-subtasks-list {
        padding-left: 12px;
        border: none;
        border-radius: 0;
        border-bottom: 1px solid $grey300;
        background-color: #fefefe;
    }

</style>
