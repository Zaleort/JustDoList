<template>
    <div v-show="show" class="dialog-container" @click="close">
        <transition enter-active-class="animate faster fade-in-up-slight">
            <div v-show="show" class="dialog-content" @click.stop>
                <slot></slot>
            </div>
        </transition>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class ModalDialog extends Vue {
    @Prop() private show!: boolean;

    private mounted() {
        document.addEventListener('keydown', (e) => {
            if (this.show && e.keyCode === 27) {
                this.close();
            }
        });
    }

    private close(): void {
        this.$emit('close');
    }
}
</script>
