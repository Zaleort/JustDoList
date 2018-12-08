<template>
    <div class="dialog-container">
        <div class="dialog-content">
            <div class="dialog-header">
                <h1 class="font-white dialog-title">Crear tarea pendiente</h1>
            </div>
            <form class="dialog-form" action="">
                <label class="dialog-form-group">
                    <p class="dialog-form-name">Tarea</p>
                    <input class="dialog-form-input" placeholder="Limpiar los platos" type="text">
                </label>
                <label class="dialog-form-group">
                    <p class="dialog-form-name">Notas</p>
                    <textarea class="dialog-form-input" name="" id="" cols="30" rows="10"></textarea>
                </label>
                <label class="dialog-form-group">
                    <p class="dialog-form-name">Subtareas</p>
                    <input class="dialog-form-input" type="text">
                </label>
                <div class="dialog-footer">
                    <input class="mr-1 button button-alpha font-danger" type="button" value="Cancelar">
                    <input class="button button-success" type="submit" value="Crear Tarea">
                </div>
            </form>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class TareaPendienteDialog extends Vue {

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

