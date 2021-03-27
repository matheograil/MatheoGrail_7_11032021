<template>
    <div class='auth'>
        <h2 class='auth__title'>Connectez-vous pour continuer...</h2>
        <div class='auth__form'>
            <div class='auth__inputs'>
                <input class='auth__input' v-model='email' placeholder='Adresse électronique'>
                <input class='auth__input' type='password' v-model='password' placeholder='Mot de passe'>
            </div>
        </div>
        <a class='auth__go' v-on:click='login' type='button'>Se connecter</a>
    </div>
</template>

<script>
    export default {
        data: function () {
            return {
                email: null,
                password: null
            }
        },
        methods: {
            login() {
                // Déclaration des variables.
                const email = this.email,
                password = this.password

                // Vérification des variables.
                const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                if (!email || !emailRegex.test(String(email).toLowerCase()) || email.length > 50 ||
                    !password || typeof password !== 'string' || password.length > 100 || password.length < 10) {
                    return false
                }

                // Envoie des données à l'API.
            }
        }
    }
</script>

<style lang='scss'>
    @import '../styles/auth.scss'
</style>