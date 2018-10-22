<template>
    <header>
        <i class="icon menu-icon">
            <img src="../assets/hamburger.svg" alt="Abrir menú">
        </i>
        <h1 class="font-white logo">JustDoList</h1>
        <i class="icon options-icon">
            <img src="../assets/more_vert.svg" alt="Más opciones">
        </i>
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

header {
    position: fixed;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    background-color: $primary;
    padding: 16px 12px;
    box-shadow: 0 0 20px -3px rgba(0, 0, 0, .33);
}

.logo {
    font-family: $comfortaa;
    margin: 0;
    font-size: 1.3em;
}
</style>

