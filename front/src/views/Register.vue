<template>
    <div class="auth">
        <h2 class="auth__title">Vous pouvez aussi vous inscrire !</h2>
        <div class="auth__form">
            <div class="auth__inputs">
                <input class="auth__input" type="text" v-model="firstName" placeholder="Prénom">
                <input class="auth__input" type="text" v-model="lastName" placeholder="Nom">
                <input class="auth__input" type="email" v-model="email" placeholder="Adresse électronique">
                <input class="auth__input" type="password" v-model="password" placeholder="Mot de passe">
                <input class="auth__input" type="password" v-model="passwordConfirmation" placeholder="Mot de passe">
            </div>
        </div>
        <a class="auth__go" v-on:click="register" type="button">S'inscrire</a>
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
                const firstName = this.firstName,
                lastName = this.lastName,
                email = this.email,
                password = this.password,
                passwordConfirmation = this.passwordConfirmation

                if (!firstName || !lastName || !email || !password || !passwordConfirmation) {
                    return false
                }

                alert('hey')
            }
        }
    }
</script>

<style lang="scss">
    @import "../styles/auth.scss"
</style>
