<template>
    <main class="container">
        <div class="tasks-view-heading-container" :key="'header'">
            <h1 class="font-primary">Completadas</h1>
            <div class="filter-container">
            </div>
        </div>

        <transition-group
            name="task-transition"
            tag="section"
            class="tasks-section tasks-completed-section"
            enter-active-class="animate fastest fade-in-up-slight"
            leave-active-class="absolute animate fastest fade-out"
            move-class="move">

            <div class="full-width alert-info mt-1" v-if="Object.keys(completed).length === 0 || !completed" :key="'info'">
                <p>
                    Este es tu historial de tareas completadas. Desde aquí puedes devolver tus tareas a pendientes. ¡Completa una
                    tarea pendiente para que aparezca aquí!
                </p>
            </div>
            <task-completed v-for="(task, id) in completed" :key="id" :id="id" v-bind="task" />
        </transition-group>
    </main>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import TaskCompleted from '../components/TaskCompleted.vue';
import { mapState } from 'vuex';

@Component({
    components: { TaskCompleted },

    computed: {
        ...mapState({
            completed: (state) => (state as any).pending.completed,
        }),
    },
})

export default class Completed extends Vue {}
</script>

<style lang="scss">
@import '../scss/variables';

.tasks-completed-section {
    flex-wrap: wrap;
    justify-content: space-between;
}

.tasks-completed-section > .task-card {
    flex: 0 1 49%;
}

</style>
