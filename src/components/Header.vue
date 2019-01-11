<template>
    <header class="nav-bar">
        <span class="icon menu-icon" @click="$store.dispatch('toggleNav')">
            <img src="../assets/hamburger.svg" alt="Abrir menú">
        </span>
        <a class="font-white logo" href="/">JustDoList</a>
        <span class="icon options-icon">
            <img src="../assets/more_vert.svg" alt="Más opciones">
        </span>
    </header>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Header extends Vue {

}
</script>


<style lang="scss">
@import '../scss/variables';

.nav-bar {
    position: sticky;
    z-index: 100;
    top: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    background-color: $primary;
    padding: 16px 16px;
    box-shadow: 0 0 20px -3px rgba(0, 0, 0, .33);
}

.logo {
    font-family: $comfortaa;
    margin: 0;
    font-size: 1.3em;
    font-weight: bold;
    text-decoration: none;
}

@media only screen and (min-width: $laptop) {
    .nav-bar {
        padding: 24px 21px;
    }

    .menu-icon {
        display: none;
    }
}
</style>
