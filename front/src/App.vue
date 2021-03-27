<template>
    <div id='app'>
        <div class='header'>
            <h1 class='header__title'>Groupomania</h1>
            <div class='header__nav'>
                <router-link to='/'>Connexion</router-link> •
                <router-link to='/register'>Inscription</router-link>
            </div>
        </div>
        <router-view/>
    </div>
</template>