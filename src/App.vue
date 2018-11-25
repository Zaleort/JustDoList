<template>
    <div id="app">
        <Header />
        <NavMenu />
        <router-view/>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Header from './components/Header.vue';
import NavMenu from './components/NavMenu.vue';

@Component({
    components: { Header, NavMenu },
})

export default class App extends Vue {}
</script>

<style lang="scss">
</style>
