<template>
    <main class="container">
        <h1 class="font-primary">Tareas</h1>
        <div>
            Búsqueda - Etiquetas
        </div>
        <section class="tasks-section">
            <!-- Tareas Pendientes -->
            <section class="tasks-daily-section">
                <div class="tasks-header">
                    <h2 class="tasks-heading">Tareas diarias</h2>
                    <img @click="openDailyDialog" 
                        class="icon add-icon" 
                        src="../assets/add_circle.svg" 
                        alt="Añadir tarea diaria">
                </div>
                <div class="alert-info mt-1" v-if="dailyTasks.length === 0 || !dailyTasks">
                    <p>
                        Haz click en el botón + para añadir una nueva tarea diaria. Las tareas diarias se reinician automáticamente
                        a medianoche y llevan un seguimiento de tu racha.
                    </p>
                </div>
                <Task v-for="task of dailyTasks" :key="task.id" v-bind="task"/>
            </section>


            <!-- Tareas Pendientes -->
            <section class="tasks-pending-section">
                <div class="tasks-header">
                    <h2 class="tasks-heading">Tareas pendientes</h2>
                    <img @click="openPendingDialog" 
                        class="icon add-icon" 
                        src="../assets/add_circle.svg" 
                        alt="Añadir tare pendiente">
                </div>
                <div class="alert-info mt-1" v-if="pendingTasks.length === 0 || !pendingTasks">
                    <p>
                        Haz click en el botón + para añadir una nueva tarea pendiente. Puedes especificar un plazo para terminar
                        las tareas pendientes, y una vez completadas se moverán a tu historial de tareas completadas.
                    </p>
                </div>
                <Task v-for="task in pendingTasks" :key="task.id" v-bind="task"/>
            </section>
        </section>

        <TaskPendingDialog />
    </main>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Task from '../components/Task.vue';
import TaskPendingDialog from '../components/TaskPendingDialog.vue';
import { mapState } from 'vuex';

@Component({
    components: { Task, TaskPendingDialog },

    computed: {
        ...mapState({
            pendingTasks: (state) => (state as any).pending.tasks,
            pendingCurrentTask: (state) => (state as any).pending.current,
            dailyTasks: (state) => (state as any).daily.tasks,
        }),
    },
})

export default class TasksView extends Vue {
    private openDailyDialog() {
        document.getElementById('task-daily-heading')!.innerHTML = 'Crear nueva tarea diaria';
        this.$store.dispatch('openDialog', 'task-daily-dialog');
    }

    private openPendingDialog() {
        document.getElementById('task-pending-heading')!.innerHTML = 'Crear nueva tarea pendiente';
        this.$store.dispatch('openDialog', 'task-pending-dialog');
    }
}
</script>

<style lang="scss">
    @import '../scss/variables';

    .tasks-section {
        padding-bottom: 4em;
    }

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
