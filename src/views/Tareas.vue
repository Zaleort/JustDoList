<template>
    <div class="container">
        <h1 class="font-primary">Tareas</h1>
        <div>
            Busqueda - Etiquetas
        </div>
        <div class="tareas-section">
            <div class="tareas-diarias-section">
                <div class="tareas-header">
                    <h2 class="tareas-title">Tareas diarias</h2>
                    <img @click=addTarea class="icon add-icon" src="../assets/add_circle.svg" alt="Añadir tarea">
                </div>
                <TareaLista v-for="listas of tareasDiarias" :key="listas.id" :titulo="listas.titulo"/>
            </div>
            <div class="tareas-pendientes-section">
                <div class="tareas-header">
                    <h2 class="tareas-title">Tareas pendientes</h2>
                    <img @click=addTarea class="icon add-icon" src="../assets/add_circle.svg" alt="Añadir tarea">
                </div>
                <TareaLista />
            </div>
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
    private tareasDiarias = [ {id: 1, titulo: 'Tarea 1'} ];
    private numTarea = 1;

    private addTarea(): void {
        this.tareasDiarias.push({ id: this.numTarea += 1, titulo: `Tarea ${this.numTarea}` });
    }
}
</script>

<style lang="scss">
    @import '../scss/variables';

    .tareas-title {
        margin: 0;
        font-weight: 400;
    }

    .tareas-header {
        margin-top: 32px;
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .add-icon {
        margin-left: 8px;
    }

    @media only screen and (min-width: $laptop) {
        .tareas-section {
            display: flex;
            flex-direction: row;
        }

        .tareas-diarias-section, .tareas-pendientes-section {
            width: 50%;
        }

        .tareas-pendientes-section {
            margin-left: 16px;
        }
    }
</style>
