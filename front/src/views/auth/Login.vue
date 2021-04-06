<template>
    <div class='auth'>
        <h2 class='auth__title'>Connectez-vous pour continuer...</h2>
        <div class='form'>
            <div class='form__status' v-if='isUserConnected() !== false'>✅ Redirection dans quelques instants...</div>
            <div class='form__status' v-else-if="requestStatus === 'success'">✅ Vous êtes connecté(e), redirection dans quelques instants...</div>
            <div class='form__status' v-else-if="requestStatus === 'failure'">❌ Informations incorrectes.</div>
            <div class='form__inputs'>
                <input class='form__input' v-model='email' placeholder='Adresse électronique'>
                <input class='form__input' type='password' v-model='password' placeholder='Mot de passe'>
            </div>
            <a class='btn btn-success' v-on:click='login'>Se connecter</a>
        </div>
    </div>
</template>

<script>
    import globalMixins from '../../mixins/Global'

    export default {
        data: function () {
            return {
                email: null,
                password: null,
                requestStatus: null
            }
        },
        created: function () {
            // Si l'utilisateur est connecté on le redirige.
            if (this.isUserConnected() !== false) {
                setTimeout(() => {  this.$router.push('/home') }, 2000)
            }
        },
        mixins: [globalMixins],
        methods: {
            // Connexion d'un utilisateur.
            login() {
                const email = this.email,
                password = this.password
                if ((!email || !this.emailRegex.test(String(email).toLowerCase()) || email.length > 50) ||
                    (!password || typeof password !== 'string' || password.length > 100 || password.length < 10)) {
                    return this.requestStatus = 'failure'
                }
                const requestOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: email, password: password  })
                }
                fetch('http://localhost:3000/api/auth/login', requestOptions).then(response => response.json())
                    .then(data => {
                        if (!data.error) {
                            this.email = null
                            this.password = null
                            localStorage.setItem('groupomania_userId', data.userId)
                            localStorage.setItem('groupomania_authorizationToken', data.token)
                            setTimeout(() => {  window.location.href = '/home' }, 3000)
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