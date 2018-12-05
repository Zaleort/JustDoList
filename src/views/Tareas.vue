<template>
    <div class="container">
        <h1 class="font-primary">Tareas</h1>
        <div>
            Busqueda - Etiquetas
        </div>
        <div class="tareas-diarias-section">
            <div class="tareas-diarias-header">
                <h2 class="tareas-title">Tareas diarias</h2>
                <img @click=addTarea class="icon add-icon" src="../assets/add_circle.svg" alt="Añadir tarea">
            </div>
            <TareaLista />
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import TareaLista from '../components/TareaLista.vue';

@Component({
    components: { TareaLista },

})

export default class Tareas extends Vue {
    private addTarea() : void {

    }
}
</script>

<style lang="scss">
    @import '../scss/variables';

    .tareas-title {
        margin: 0;
        font-weight: 400;
    }

    .tareas-diarias-header {
        margin-top: 16px;
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .add-icon {
        margin-left: 8px;
    }
</style>
