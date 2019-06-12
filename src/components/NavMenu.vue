<template>
    <div class="nav-container" id="nav-menu">
        <nav class="nav-menu">
            <ul class="nav-menu-list">
                <li @click="$store.dispatch('closeNav')"><router-link class="nav-menu-link" to="/">Tareas</router-link></li>
                <li @click="$store.dispatch('closeNav')"><router-link class="nav-menu-link" to="/completadas">Completadas</router-link></li>
            </ul>
        </nav>
        <div class="nav-back" @click="$store.dispatch('closeNav')"></div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class NavMenu extends Vue {
    private windowWidth: number = window.innerWidth;

    private getWindowWidth(): void {
        this.windowWidth = window.innerWidth;
    }

    private checkWidth(): void {
        this.getWindowWidth();

        if (this.windowWidth > 1024) {
            this.$store.dispatch('closeNav');
        }
    }

    private mounted() {
        window.addEventListener('resize', this.checkWidth);
    }

    private beforeDestroy() {
        window.removeEventListener('resize', this.checkWidth);
    }

}
</script>

<style lang="scss">
    @import '../scss/variables';

    .nav-container {
        position: fixed;
        display: flex;
        z-index: 100;
        flex-direction: row;
        left: -225px;
        transition: transform 0.33s;
        background-color: rgba(0, 0, 0, 0.33);
    }

    .nav-menu {
        min-width: 225px;
        height: 100vh;
        background-color: $grey100;
        border-right: 1px solid $grey200;
        transition: all 0.33s;
    }

    .nav-menu-show {
        width: 175%;
        height: 100%;
        transform: translate(225px);
    }

    .nav-menu-list {
        display: flex;
        flex-direction: column;
        margin: 0;
        padding: 16px 0;
        list-style-type: none;
    }

    .nav-menu-link {
        display: block;
        text-decoration: none;
        font-size: 1.2em;
        padding: 12px 21px;
        color: $grey700;
        border-left: 0 solid $primary;
        transition: background-color 0.14s, border 0.09s;
    }

    .nav-menu-link:hover {
        background-color: $grey300;
    }

    .router-link-exact-active {
        color: $grey800;
        background-color: $grey300;
        border-left-width: 7px;
    }

    .nav-back {
        width: 100%;
        height: 100%;
    }

    @media only screen and (min-width: $laptop) {
        .nav-container {
            transform: translate(225px);
        }

        .nav-menu-show {
            width: auto;
            height: auto;
        }
    }
</style>
