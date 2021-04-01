<template>
    <div id='app'>
        <div class='header'>
            <h1 class='header__title'>Groupomania</h1>
            <div class='header__nav'>
                <div v-if='isUserConnected() === false'>
                    <router-link to='/'>Connexion</router-link> •
                    <router-link to='/register'>Inscription</router-link>
                </div>
                <div v-else>
                    <router-link to='/home'>Accueil</router-link> •
                    <router-link :to="{ name: 'Profile', params: { id: this.userId }}">Mon profil</router-link> •
                    <router-link to='/account'>Mon compte</router-link> •
                    <a style='cursor:pointer' v-on:click='logout'>Déconnexion</a>
                </div>
            </div>
        </div>
        <router-view/>
    </div>
</template>

<script>
    import globalMixins from './mixins/Global'

    export default {
        mixins: [globalMixins]
    }
</script>