<template>
    <modal-dialog :show="show" @close="closeDialog">
        <div class="dialog-header">
            <h1 ref="taskHeading" class="font-white dialog-title">{{ heading }}</h1>
        </div>
        <div id="task-daily-form" class="dialog-form">
            <label class="dialog-form-group">
                <p class="dialog-form-name">Tarea</p>
                <input @blur="validateTaskName"
                    @keydown.enter="submit"
                    ref="taskName" 
                    class="text-input"
                    v-model="current.name"
                    placeholder="Limpiar los platos" 
                    type="text">
            </label>

            <label class="dialog-form-group">
                <p class="dialog-form-name">Notas</p>
                <textarea ref="taskNotes" class="dialog-form-textarea text-input" rows="4" v-model="current.notes"></textarea>
            </label>

            <div class="dialog-form-group">
                <p class="dialog-form-name">Subtareas</p>
                <div class="relative subtask-group" v-for="(subTask, id) of current.subTasks" :key="id">
                    <span @click="deleteSubTask(id)" class="delete-subtask-icon">
                        <svg class="icon" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                            <path d="M0 84V56c0-13.3 10.7-24 24-24h112l9.4-18.7c4-8.2 12.3-13.3 21.4-13.3h114.3c9.1 0 17.4 5.1 21.5 13.3L312 32h112c13.3 0 24 10.7 24 24v28c0 6.6-5.4 12-12 12H12C5.4 96 0 90.6 0 84zm416 56v324c0 26.5-21.5 48-48 48H80c-26.5 0-48-21.5-48-48V140c0-6.6 5.4-12 12-12h360c6.6 0 12 5.4 12 12zm-272 68c0-8.8-7.2-16-16-16s-16 7.2-16 16v224c0 8.8 7.2 16 16 16s16-7.2 16-16V208zm96 0c0-8.8-7.2-16-16-16s-16 7.2-16 16v224c0 8.8 7.2 16 16 16s16-7.2 16-16V208zm96 0c0-8.8-7.2-16-16-16s-16 7.2-16 16v224c0 8.8 7.2 16 16 16s16-7.2 16-16V208z"></path>
                        </svg>
                    </span>
                    <input class="text-input right-icon full-width dialog-subtasks-list" 
                        type="text"
                        :value="subTask.name"
                        ref="subTasks"
                        @blur="updateSubTaskName(id, $event)">
                </div>
                <div class="relative subtask-group">
                    <span @click="addSubTask" class="text-input-icon left">
                        <svg class="icon" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                            <path fill="#4caf50" d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"></path>
                        </svg>
                    </span>
                    <input @keydown.enter="addSubTask" 
                        ref="taskSubTask"
                        class="text-input left-icon full-width dialog-subtasks-list" 
                        type="text"
                        placeholder="Añadir nueva subtarea">
                </div>
            </div>

            <label class="dialog-form-group">
                <p class="dialog-form-name">Repetir cada</p>
                <div class="dialog-form-daily-select-group">
                    <input @blur="validateFrecuency"
                        v-model="frecuencyNumber"
                        class="text-input" 
                        type="number" min="1" 
                        ref="frecuencyNumber">
                    <select v-model="frecuencyType" class="text-input" ref="frecuency">
                        <option value="d">Días</option>
                        <option value="w">Semanas</option>
                        <option value="m">Meses</option>
                        <option value="y">Años</option>
                    </select>
                </div>
            </label>

            <div class="dialog-form-group">
                <p class="dialog-form-name">Etiquetas</p>
                <div class="dialog-form-group">
                    <search-select :items="selectTags"
                        :placeholder="'Añadir etiquetas'"
                        :noResults="'Sin resultados, se creará una etiqueta nueva'"
                        @selected="addTag" 
                        @created="addNewTag"/>
                </div>
                <div>
                    <transition-group
                        tag="div"
                        class="tag-cloud"
                        enter-active-class="animate faster fade-in-up-slight"
                        move-class="move">
                            <tag v-for="(tag, id) in tagCloud" 
                                :key="id"
                                :id="id"
                                v-bind="tag"
                                :isModal="true"
                                :type="'daily'" />
                    </transition-group>
                </div>
            </div>

            <div class="dialog-footer">
                <input type="hidden" ref="taskId" v-model="currentId">
                <input @click="closeDialog" class="mr-1 cancel-button button button-alpha font-danger" type="button" value="Cancelar">
                <input @click="processTask" ref="taskSubmit" class="save-button button button-success" type="submit" :value="submitText">
            </div>
        </div>
    </modal-dialog>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import ModalDialog from './ModalDialog.vue';
import SearchSelect from './SearchSelect.vue';
import Tag from './Tag.vue';

@Component({
    components: { ModalDialog, SearchSelect, Tag },
})

export default class TaskDailyDialog extends Vue {
    @Prop() private show!: boolean;
    @Prop() private heading!: string;
    @Prop() private submitText!: string;

    get current() {
        return this.$store.state.daily.current;
    }

    get currentId(): string {
        return this.$store.state.daily.currentId;
    }

    set frecuencyNumber(fNumber: number) {
        this.$store.commit('daily/SET_CURRENT_FRECUENCY_NUMBER', fNumber);
    }

    get frecuencyNumber() {
        const current = this.$store.state.daily.current.frecuency;
        return current.substring(1, current.length);
    }

    set frecuencyType(type: string) {
        this.$store.commit('daily/SET_CURRENT_FRECUENCY_TYPE', type);
    }

    get frecuencyType() {
        const current = this.$store.state.daily.current.frecuency;
        return current.charAt(0);
    }

    get tagCloud(): ITags {
        if (!this.$store.state.tag) { return {}; }

        const ids = this.current.tags;
        if (ids == null) { return {}; }

        const tags: ITags = {};

        for (const id in this.$store.state.tag.tags) {
            if (ids[id] != null) {
                tags[id] = this.$store.state.tag.tags[id];
            }
        }

        return tags;
    }

    get selectTags(): ITags {
        if (!this.$store) { return {}; }

        const all = this.$store.state.tag.tags;
        return all;
    }

    private addSubTask(): void {
        const taskName = (this.$refs.taskSubTask as HTMLInputElement).value;

        if (!taskName || taskName.trim().length === 0) { return; }

        const subTask: ISubTask = {
            name: taskName,
            checked: false,
        };

        this.$store.dispatch('daily/addCurrentSubTask', subTask);
        (this.$refs.taskSubTask as HTMLInputElement).value = '';
    }

    private deleteSubTask(id: string): void {
        this.$store.dispatch('daily/deleteCurrentSubTask', id);
    }

    private updateSubTaskName(id: string, event: any) {
        const name = event.target.value;
        this.$store.dispatch('daily/updateCurrentSubTaskName', { id, name });
    }

    private addTag(id: string): void {
        this.$store.dispatch('daily/addCurrentTag', id);
    }

    private addNewTag(name: string): void {
        const newTag = {
            name,
            color: '#7400C9',
        } as ITag;

        this.$store.dispatch('tag/addTag', newTag).then(response => {
            this.$store.dispatch('daily/addCurrentTag', response.id);
        });
    }

    private processTask(): void {
        if (!this.validateTaskName()) { return; }
        if (!this.validateFrecuency()) { return; }

        const lastSubTask = (this.$refs.taskSubTask as HTMLInputElement).value;

        if (lastSubTask) {
            const subTask = {
                name: lastSubTask,
                checked: false,
            };

            this.$store.dispatch('daily/addCurrentSubTask', subTask);
        }

        if (!this.currentId || this.currentId.length <= 0) {
            this.$store.dispatch('daily/addTask', this.current);
        } else {
            this.$store.dispatch('daily/updateTask', {id: this.currentId, task: this.current});
        }

        this.closeDialog();
    }

    private validateTaskName(): boolean {
        const taskName = this.$refs.taskName as HTMLInputElement;

        if (!taskName.value || taskName.value.trim().length === 0) {
            taskName.classList.add('input-error');
            return false;
        }

        taskName.classList.remove('input-error');
        return true;
    }

    private validateFrecuency(): boolean {
        const frecuency = this.$refs.frecuencyNumber as HTMLInputElement;

        if (!frecuency.value || frecuency.value.trim().length === 0 || parseInt(frecuency.value, 10) < 0) {
            frecuency.classList.add('input-error');
            return false;
        }

        frecuency.classList.remove('input-error');
        return true;
    }

    // Evita que se muestre el outline de error, forzando el blur antes que
    // processTask
    private submit() {
        (this.$refs.taskName as HTMLInputElement).blur();
        (this.$refs.taskSubmit as HTMLElement).click();
    }

    private closeDialog(): void {
        this.$emit('close');
        this.$store.commit('daily/RESET_CURRENT_TASK');
        this.resetDialog();
    }

    private resetDialog(): void {
        (this.$refs.taskId as HTMLInputElement).value = '';

        const taskName = this.$refs.taskName as HTMLInputElement;
        taskName.value = '';
        taskName.classList.remove('input-error');

        const frecuencyNumber = (this.$refs.frecuencyNumber as HTMLInputElement);
        frecuencyNumber.value = '1';
        frecuencyNumber.classList.remove('input-error');

        (this.$refs.frecuency as HTMLSelectElement).selectedIndex = 0;
        (this.$refs.taskNotes as HTMLInputElement).value = '';
        (this.$refs.taskSubTask as HTMLInputElement)!.value = '';
    }
}
</script>
