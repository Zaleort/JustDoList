<template>
    <label class="checkbox-group--sm">
        <input @change="updateCheck" ref="checkbox" class="checkbox" type="checkbox" :checked="checked">
        <div class="checkbox-indicator--sm"></div>
        <p class="checkbox-title">{{ name }}</p>
    </label>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class SubTask extends Vue {
    @Prop() private id!: string;
    @Prop() private name!: string;
    @Prop() private checked!: boolean;
    @Prop() private taskId!: string;
    @Prop() private taskType!: string;

    private updateCheck() {
        const checked = (this.$refs.checkbox as HTMLInputElement).checked;
        const payload = {
            checked,
            id: this.id,
            taskId: this.taskId,
        };

        this.$store.dispatch(this.taskType + '/updateCheck', payload);
    }
}
</script>
