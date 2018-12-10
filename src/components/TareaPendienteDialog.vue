<template>
    <div class="dialog-container" id="tarea-pendiente-dialog">
        <div class="dialog-content">
            <div class="dialog-header">
                <h1 class="font-white dialog-title">{{ title }}</h1>
            </div>
            <form id="tarea-pendiente-form" class="dialog-form" action="">
                <div></div>
                <label class="dialog-form-group">
                    <p class="dialog-form-name">Tarea</p>
                    <input id="tarea-pendiente-titulo" class="dialog-form-input" placeholder="Limpiar los platos" type="text">
                </label>
                <label class="dialog-form-group">
                    <p class="dialog-form-name">Notas</p>
                    <textarea id="tarea-pendiente-nota" class="dialog-form-input" cols="30" rows="10"></textarea>
                </label>
                <label class="dialog-form-group">
                    <p class="dialog-form-name">Subtareas</p>
                    <input id="tarea-pendiente-subtarea" class="dialog-form-input" type="text">
                </label>
                <div class="dialog-footer">
                    <input type="hidden" id="tarea-pendiente-id" value="1">
                    <input @click="closeDialog" class="mr-1 button button-alpha font-danger" type="button" value="Cancelar">
                    <input @click="procesarTarea" class="button button-success" type="submit" :value="action">
                </div>
            </form>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import '../interfaces/ITareaPendiente';

@Component
export default class TareaPendienteDialog extends Vue {
    private title: string = 'Crear tarea pendiente';
    private action: string = 'Crear tarea';

    private procesarTarea(): void {
        const tareaId: string = (document.getElementById('tarea-pendiente-id') as HTMLInputElement).value;
        const tareaTitulo: string = (document.getElementById('tarea-pendiente-titulo') as HTMLInputElement).value;
        const nota: string = (document.getElementById('tarea-pendiente-nota') as HTMLInputElement).value;
        const subtarea: string = (document.getElementById('tarea-pendiente-subtarea') as HTMLInputElement).value;

        const tarea: ITareaPendiente = {
            id: tareaId,
            titulo: tareaTitulo,
            hasSubTareas: true,
            subTareas: [{
                id: 1,
                titulo: subtarea,
                checked: false },
            ],
        };

        if (!tarea.id) {
            // Generar y asignar ID
            // Añadir tarea
            this.$store.dispatch('pendientes/addTarea', tarea);
        } else {
            this.$store.dispatch('pendientes/updateTarea', tarea);
        }

        this.closeDialog();
    }

    private closeDialog(): void {
        this.$store.dispatch('closeDialog', 'tarea-pendiente-dialog');
        const form = document.getElementById('tarea-pendiente-form') as HTMLFormElement;

        form.reset();
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

