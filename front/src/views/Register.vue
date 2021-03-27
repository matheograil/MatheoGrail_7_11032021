<template>
    <div class='auth'>
        <h2 class='auth__title'>Vous pouvez aussi vous inscrire !</h2>
        <div class='auth__form'>
            <div class='auth__inputs'>
                <input class='auth__input' v-model='firstName' placeholder='Prénom'>
                <input class='auth__input' v-model='lastName' placeholder='Nom'>
                <input class='auth__input' v-model='email' placeholder='Adresse électronique'>
                <input class='auth__input' type='password' v-model='password' placeholder='Mot de passe'>
                <input class='auth__input' type='password' v-model='passwordConfirmation' placeholder='Mot de passe'>
            </div>
        </div>
        <a class='auth__go' v-on:click='register' type='button'>S'inscrire</a>
    </div>
</template>

<script>
    export default {
        data: function () {
            return {
                firstName: null,
                lastName: null,
                email: null,
                password: null,
                passwordConfirmation: null
            }
        },
        methods: {
            register() {
                // Déclaration des variables.
                const firstName = this.firstName,
                lastName = this.lastName,
                email = this.email,
                password = this.password,
                passwordConfirmation = this.passwordConfirmation

                // Vérification des variables.
                const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                if (!firstName || typeof firstName !== 'string' || firstName.length > 50 ||
                    !lastName || typeof lastName !== 'string' || lastName.length > 50 ||
                    !email || !emailRegex.test(String(email).toLowerCase()) || email.length > 50 ||
                    !password || typeof password !== 'string' || password.length > 100 || password.length < 10 ||
                    password !== passwordConfirmation) {
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