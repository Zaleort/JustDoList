<template>
    <main class="container">
        <h1 class="font-primary">Tareas</h1>
        <div>
            Busqueda - Etiquetas
        </div>
        <section class="tasks-section">
            <!-- Tareas Pendientes -->
            <section class="tasks-daily-section">
                <div class="tasks-header">
                    <h2 class="tasks-heading">Tareas diarias</h2>
                    <img @click="$store.dispatch('daily/addTask', { id: 1, name: `Tarea 1` })" 
                        class="icon add-icon" 
                        src="../assets/add_circle.svg" 
                        alt="Añadir tarea diaria">
                </div>
                <TasksList v-for="task of $store.state.daily.tasks" :key="task.id" :titulo="task.name"/>
            </section>


            <!-- Tareas Pendientes -->
            <section class="tasks-pending-section">
                <div class="tasks-header">
                    <h2 class="tasks-heading">Tareas pendientes</h2>
                    <img @click="$store.dispatch('openDialog', 'tarea-pendiente-dialog')" 
                        class="icon add-icon" 
                        src="../assets/add_circle.svg" 
                        alt="Añadir tare pendiente">
                </div>
                <TasksList v-for="task in $store.state.pending.tasks" :key="task.id" v-bind="task"/>
            </section>
        </section>

        <TaskPendingDialog />
    </main>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import TasksList from '../components/TasksList.vue';
import TaskPendingDialog from '../components/TaskPendingDialog.vue';

@Component({
    components: { TasksList, TaskPendingDialog },

})

export default class TasksView extends Vue {

}
</script>

<style lang="scss">
    @import '../scss/variables';

    .tasks-heading {
        margin: 0;
        font-weight: 400;
    }

    .tasks-header {
        margin-top: 32px;
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .add-icon {
        margin-left: 8px;
    }

    @media only screen and (min-width: $laptop) {
        .tasks-section {
            display: flex;
            flex-direction: row;
        }

        .tasks-daily-section, .tasks-pending-section {
            width: 50%;
        }

        .tasks-pending-section {
            margin-left: 16px;
        }
    }
</style>
