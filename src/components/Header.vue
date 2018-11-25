<template>
    <header class="nav-bar">
        <i class="icon menu-icon" @click=openMenu>
            <img src="../assets/hamburger.svg" alt="Abrir menú">
        </i>
        <a class="font-white logo" href="/">JustDoList</a>
        <i class="icon options-icon">
            <img src="../assets/more_vert.svg" alt="Más opciones">
        </i>
    </header>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Header extends Vue {
    private openMenu(): void {
        const navMenu: any = document.getElementById('nav-menu');
        navMenu.classList.toggle('nav-menu-show');
    }
}
</script>


<style lang="scss">
@import '../scss/variables';

.nav-bar {
    position: sticky;
    top: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    background-color: $primary;
    padding: 24px 16px;
    box-shadow: 0 0 20px -3px rgba(0, 0, 0, .33);
}

.logo {
    font-family: $comfortaa;
    margin: 0;
    font-size: 1.3em;
    font-weight: bold;
    text-decoration: none;
}

.menu-icon:hover {
    cursor: pointer;
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

