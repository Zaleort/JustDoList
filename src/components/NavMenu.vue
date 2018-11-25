<template>
    <nav class="nav-menu" id="nav-menu">
        <ul class="nav-menu-list">
            <li><router-link class="nav-menu-link" to="/tareas">Tareas</router-link></li>
            <li><router-link class="nav-menu-link" to="/completadas">Completadas</router-link></li>
            <li><router-link class="nav-menu-link" to="/estadisticas">Estadísticas</router-link></li>
            <li><router-link class="nav-menu-link" to="/grupos">Grupos</router-link></li>
        </ul>
    </nav>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class NavMenu extends Vue {

}
</script>

<style lang="scss">
    @import '../scss/variables';

    .nav-menu {
        position: fixed;
        left: -225px;
        width: 225px;
        height: 100%;
        background-color: $grey100;
        border-right: 1px solid $grey200;
        transition: all 0.33s;
    }

    .nav-menu-show {
        left: 0;
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

    .router-link-active {
        color: $grey800;
        background-color: $grey300;
        border-left-width: 7px;
    }

    @media only screen and (min-width: $laptop) {
        .nav-menu {
            left: 0;
        }
    }
</style>
