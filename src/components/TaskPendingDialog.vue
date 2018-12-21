<template>
    <div class="dialog-container" id="tarea-pendiente-dialog">
        <div class="dialog-content">
            <div class="dialog-header">
                <h1 id="tarea-pendiente-header-title" class="font-white dialog-title">Nueva tarea pendiente</h1>
            </div>
            <form id="task-pending-form" class="dialog-form" @submit.prevent="procesarTarea">
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
                    <input id="task-pending-subtask" class="dialog-form-input" type="text">
                </label>
                <div class="dialog-footer">
                    <input type="hidden" id="task-pending-id" value="">
                    <input @click="closeDialog" class="mr-1 button button-alpha font-danger" type="button" value="Cancelar">
                    <input id="task-pending-submit" class="button button-success" type="submit" value="Crear tarea">
                </div>
            </form>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class TaskPendingDialog extends Vue {
    private procesarTarea(): void {
        const taskId = (document.getElementById('task-pending-id') as HTMLInputElement).value;
        const taskName = (document.getElementById('task-pending-name') as HTMLInputElement).value;
        const nota = (document.getElementById('task-pending-notes') as HTMLInputElement).value;
        const subTaskName = (document.getElementById('task-pending-subtask') as HTMLInputElement).value;

        const task: ITaskPending = {
            id: taskId,
            name: taskName,
            subTasks: [
                {
                    id: '1',
                    name: subTaskName,
                    checked: false,
                },
            ],
        };

        if (!task.id) {
            // Generar y asignar ID
            // Añadir tarea
            this.$store.dispatch('pending/addTask', task);
        } else {
            this.$store.dispatch('pending/updateTask', task);
        }

        this.closeDialog();
    }

    private closeDialog(): void {
        this.$store.dispatch('closeDialog', 'tarea-pendiente-dialog');
        const form = document.getElementById('task-pending-form') as HTMLFormElement;

        form.reset();
        (document.getElementById('task-pending-id') as HTMLInputElement)!.value = '';
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

</style>
