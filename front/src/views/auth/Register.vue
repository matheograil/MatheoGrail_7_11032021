<template>
    <div class='auth'>
        <h2 class='auth__title'>Vous pouvez aussi vous inscrire !</h2>
        <div class='form'>
            <div class='form__status' v-if='isUserConnected !== false'>✅ Redirection dans quelques instants...</div>
            <div class='form__status' v-else-if="requestStatus === 'success'">✅ Merci de votre inscription !</div>
            <div class='form__status' v-else-if="requestStatus === 'failure'">❌ Informations incorrectes.</div>
            <div class='form__inputs'>
                <input class='form__input' v-model='firstName' placeholder='Prénom'>
                <input class='form__input' v-model='lastName' placeholder='Nom'>
                <input class='form__input' v-model='email' placeholder='Adresse électronique'>
                <input class='form__input' type='password' v-model='password' placeholder='Mot de passe'>
                <input class='form__input' type='password' v-model='passwordConfirmation' placeholder='Mot de passe'>
            </div>
            <a class='btn btn-success' v-on:click='register'>S'inscrire</a>
        </div>
    </div>
</template>

<script>
    import globalMixins from '../../mixins/Global'

    export default {
        data: function () {
            return {
                firstName: null,
                lastName: null,
                email: null,
                password: null,
                passwordConfirmation: null,
                requestStatus: null
            }
        },
        created: function () {
            if (this.isUserConnected !== false) {
                // Redirection.
                setTimeout(() => {  window.location.href = '/home' }, 3000)
            }
        },
        mixins: [globalMixins],
        methods: {
            register() {
                // Déclaration des variables.
                const firstName = this.firstName,
                lastName = this.lastName,
                email = this.email,
                password = this.password,
                passwordConfirmation = this.passwordConfirmation

                // Vérification des variables.
                const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                if ((!firstName || typeof firstName !== 'string' || firstName.length > 50) ||
                    (!lastName || typeof lastName !== 'string' || lastName.length > 50) ||
                    (!email || !emailRegex.test(String(email).toLowerCase()) || email.length > 50) ||
                    (!password || typeof password !== 'string' || password.length > 100 || password.length < 10) ||
                    (password !== passwordConfirmation)) {
                    return this.requestStatus = 'failure'
                }

                // Utilisation de l'API.
                const requestOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ firstName: firstName, lastName: lastName, email: email, password: password  })
                }
                fetch('http://localhost:3000/api/auth/register', requestOptions).then(response => {
                    if (response.status === 200) {
                        // Nettoyage du formulaire.
                        this.firstName = null
                        this.lastName = null
                        this.email = null
                        this.password = null
                        this.passwordConfirmation = null
                        
                        return this.requestStatus = 'success'
                    }
                    this.requestStatus = 'failure'
                }).catch(() => {
                    this.requestStatus = 'failure'
                })
            }
        }
    }
</script>