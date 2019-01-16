<template>
    <div class="card tag-card" ref="tag">
        <div class="card-header">
            <p class="m-0">{{ name }}</p>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Tag extends Vue {
    @Prop() private name!: string;
    @Prop() private color!: string;
}
</script>

<style lang="scss">
    @import '../scss/variables';

    .tag-card {
        border-left-width: 5px;
        margin-left: 7px;
        margin-right: 7px;
        padding: 7px 12px;
    }
</style>
