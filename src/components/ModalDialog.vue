<template>
    <div v-show="show" class="dialog-container" @click="close">
        <transition enter-active-class="dialog-anim">
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

<style lang="scss">
 @import '../scss/variables';

.dialog-container {
    position: fixed;
    display: flex;
    align-items: center;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
    overflow-y: scroll;
    z-index: 200;
    background-color: black;
    background-color: rgba(0, 0, 0, 0.33);
    transition: all 0.25s ease-out;
}

.dialog-content {
    z-index: 201;
    margin: 0 auto;
    margin-top: 4em;
    max-width: $tablet;
    background-color: #fefefe;
    border-radius: 3px;
}

.dialog-header {
    background-color: $primary;
    padding: 28px 16px;
    border-radius: 3px 3px 0 0;
}

.dialog-title {
    margin: 0;
    font-size: 2em;
    font-family: $raleway;
    font-weight: normal;
}

.dialog-footer {
    display: flex;
    justify-content: center;
}

.dialog-form {
    padding: 16px;
}

.dialog-form-group {
    display: flex;
    flex-direction: column;
    margin-bottom: 12px;
}

.dialog-form-name {
    user-select: none;
    font-family: $montserrat;
    margin: 7px 0;
}

.dialog-form-input {
    padding: 7px;
    font-family: $montserrat;
    border: 1px solid $grey300;
    border-radius: 0;
    transition: border 0.15s;
}

.dialog-form-input:focus {
    outline: none;
    border-color: $primary;
}

.dialog-form-textarea {
    line-height: 1.5;
}

.dialog-subtasks-list {
    padding-left: 12px;
    border: none;
    border-radius: 0;
    border-bottom: 1px solid $grey300;
    background-color: #fefefe;
}

.save-button:focus, .cancel-button:focus {
    outline: none;
}

.save-button:focus {
    background-color: $green800;
}

.cancel-button:focus {
    text-decoration: underline;
}

.dialog-anim {
    animation: fade-in-up-slight 0.4s ease;
}
</style>

