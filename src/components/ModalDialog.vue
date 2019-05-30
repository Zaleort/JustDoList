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
    z-index: 200;
    background-color: black;
    background-color: rgba(0, 0, 0, 0.33);
    transition: all 0.25s ease-out;
}

.dialog-content {
    z-index: 201;
    margin: 4em auto;
    max-width: $mobile-l;
    max-height: calc(100vh - 24px);
    overflow-y: auto;
    background-color: #fefefe;
    border-radius: 3px;
}

.dialog-header {
    text-align: center;
    background-color: $primary;
    padding: 28px 16px;
    border-radius: 3px 3px 0 0;
}

.dialog-title {
    margin: 0;
    font-size: 1.75em;
    font-family: $raleway;
    font-weight: normal;
}

.dialog-footer {
    display: flex;
    justify-content: center;
    margin-top: 16px;
}

.dialog-form {
    padding: 16px;
}

.dialog-form-group {
    display: flex;
    flex-direction: column;
    margin-bottom: 12px;
}

.dialog-form-daily-select-group {
    display: flex;
    flex-direction: column;

    input {
        width: 100%;
        margin-bottom: 7px;
    }

    select {
        width: 100%;
    }
}

.dialog-form-pending-time-group {
    display: flex;
    flex-direction: column;
}

.dialog-form-name {
    user-select: none;
    font-family: $montserrat;
    margin: 7px 0;
}

.dialog-form-textarea {
    line-height: 1.5;
}

/*
    SubTasks
*/

.dialog-subtasks-list {
    padding-left: 12px;
    border: none;
    border-radius: 0;
    border-bottom: 1px solid $grey300;
    background-color: #fefefe;
}

.delete-subtask-icon {
    display: none;
    position: absolute;
    width: 12px;
    height: 12px;
    top: 9px;
    right: 9px;
}

.delete-subtask-icon svg {
    fill: $grey600;
}

.delete-subtask-icon svg:hover {
    fill: $red500;
}

.subtask-group:hover > .delete-subtask-icon {
    display: block;
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

@media only screen and (min-width: $tablet) {
    .dialog-content {
        width: $mobile-l;
    }

    .dialog-form-daily-select-group {
        flex-direction: row;

        input {
            width: 66%;
            margin-bottom: 0;
        }

        select {
            width: 33%;
        }
    }

    .dialog-form-pending-time-group {
        flex-direction: row;
        justify-content: space-between;

        .text-input {
            width: 49%;
        }
    }

}

@media only screen and (min-width: $laptop) {
    .dialog-header {
        padding: 28px 28px;
    }
}

</style>
