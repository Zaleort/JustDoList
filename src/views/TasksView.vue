<template>
    <main class="container">
        <div class="tasks-view-heading-container">
            <h1 class="font-primary">Tareas</h1>
            <div class="filter-container">
                <input class="search-box text-input" type="search" placeholder="Buscar...">
                <button @click="openTagDialog" class="tags-button">
                    <svg class="icon tags-icon" aria-hidden="true" data-prefix="fas" data-icon="sliders-h" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                        <path d="M496 384H160v-16c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16v16H16c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h80v16c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16v-16h336c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16zm0-160h-80v-16c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16v16H16c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h336v16c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16v-16h80c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16zm0-160H288V48c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16v16H16C7.2 64 0 71.2 0 80v32c0 8.8 7.2 16 16 16h208v16c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16v-16h208c8.8 0 16-7.2 16-16V80c0-8.8-7.2-16-16-16z"></path>
                    </svg>
                    <span>Etiquetas</span>
                </button>
            </div>
        </div>
        <transition-group
            name="task-transition"
            tag="section"
            class="tasks-section"
            enter-active-class="animate fastest fade-in-up-slight"
            leave-active-class="absolute animate fastest fade-out"
            move-class="move">

            <!-- Tareas Diarias -->
            <section class="tasks-daily-section" :key="'daily'">
                <div class="tasks-header">
                    <h2 class="tasks-heading">Tareas diarias</h2>
                    <img @click="openDailyDialog" 
                        class="icon add-icon" 
                        src="../assets/add_circle.svg" 
                        alt="Añadir tarea diaria">
                </div>
                <transition-group
                    name="task-transition"
                    enter-active-class="animate faster fade-in-up-slight"
                    leave-active-class="absolute animate fastest fade-out"
                    move-class="move">
                    <div class="alert-info mt-1" v-if="dailyTasks.length === 0 || !dailyTasks" :key="'info'">
                        <p>
                            Haz click en el botón + para añadir una nueva tarea diaria. Las tareas diarias se reinician automáticamente
                            a medianoche y llevan un seguimiento de tu racha.
                        </p>
                    </div>
                    <Task @openDialog="showTaskDailyDialog = true" v-for="task of dailyTasks" :key="task.id" v-bind="task" :type="'daily'"/>
                </transition-group>
            </section>

            <!-- Tareas Pendientes -->
            <section class="tasks-pending-section" :key="'pending'">
                <div class="tasks-header">
                    <h2 class="tasks-heading">Tareas pendientes</h2>
                    <img @click="openPendingDialog" 
                        class="icon add-icon" 
                        src="../assets/add_circle.svg" 
                        alt="Añadir tare pendiente">
                </div>
                <transition-group
                    name="task-transition"
                    enter-active-class="animate faster fade-in-up-slight"
                    leave-active-class="absolute animate fastest fade-out"
                    move-class="move">
                    <div class="alert-info mt-1" v-if="pendingTasks.length === 0 || !pendingTasks" :key="'info'">
                        <p>
                            Haz click en el botón + para añadir una nueva tarea pendiente. Puedes especificar un plazo para terminar
                            las tareas pendientes, y una vez completadas se moverán a tu historial de tareas completadas.
                        </p>
                    </div>
                    <Task @openDialog="showTaskPendingDialog = true" v-for="task in pendingTasks" :key="task.id" v-bind="task" :type="'pending'"/>
                </transition-group>
            </section>
        </transition-group>

        <TaskPendingDialog :show="showTaskPendingDialog" @close="showTaskPendingDialog = false" />
        <TaskDailyDialog :show="showTaskDailyDialog" @close="showTaskDailyDialog = false" />
        <TagDialog :show="showTagDialog" @close="showTagDialog = false" />
    </main>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Task from '../components/Task.vue';
import TaskPendingDialog from '../components/TaskPendingDialog.vue';
import TaskDailyDialog from '../components/TaskDailyDialog.vue';
import TagDialog from '../components/TagDialog.vue';
import { mapState } from 'vuex';

@Component({
    components: { Task, TaskPendingDialog, TaskDailyDialog, TagDialog },

    computed: {
        ...mapState({
            pendingTasks: (state) => (state as any).pending.tasks,
            dailyTasks: (state) => (state as any).daily.tasks,
        }),
    },
})

export default class TasksView extends Vue {
    private showTaskPendingDialog: boolean = false;
    private showTaskDailyDialog: boolean = false;
    private showTagDialog: boolean = false;

    private openDailyDialog() {
        document.getElementById('task-daily-heading')!.innerHTML = 'Crear nueva tarea diaria';
        (document.getElementById('task-daily-submit') as HTMLInputElement).value = 'Crear tarea';
        this.showTaskDailyDialog = true;
    }

    private openPendingDialog() {
        document.getElementById('task-pending-heading')!.innerHTML = 'Crear nueva tarea pendiente';
        (document.getElementById('task-pending-submit') as HTMLInputElement).value = 'Crear tarea';
        this.showTaskPendingDialog = true;
    }

    private openTagDialog() {
        this.showTagDialog = true;
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

    .filter-container {
        display: flex;
        flex-direction: column;
    }

    .search-box {
        width: 100%;
        padding: 9px;
        padding-left: 35px;
        background-image: url('../assets/search-solid.svg');
        background-repeat: no-repeat;
        background-size: 16px 16px;
        background-position: center left 9px;
        margin-bottom: 12px;
    }

    .tags-button {
        display: flex;
        align-items: center;
        padding: 9px 16px;
        background-color: #ffffff;
        border: 1px solid $grey300;
        box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1);
        transition: all 0.15s;
    }

    .tags-button span {
        color: $grey500;
        transition: all 0.15s;
    }

    .tags-button:hover {
        cursor: pointer;
        border-color: $primary;
    }

    .tags-button:hover > span{
        color: $primary;
    }

    .tags-button:hover > .tags-icon{
        fill: $primary;
    }

    .tags-button:focus {
        border-color: $primary;
        outline: none;
    }

    .tags-button:focus > span {
        color: $primary;
    }

    .tags-button:focus > .tags-icon {
        fill: $primary;
    }

    .tags-icon {
        width: 18px;
        margin-right: 7px;
        fill: $grey400;
    }

    @media only screen and (min-width: $mobile-l) {
        .filter-container {
            justify-content: space-between;
            align-items: center;
            flex-direction: row;
        }

        .search-box {
            margin-bottom: 0;
            margin-right: 12px;
        }
    }

    @media only screen and (min-width: $tablet) {
        .tasks-view-heading-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
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
