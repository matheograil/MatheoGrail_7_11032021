<template>
    <div class='auth'>
        <h2 class='auth__title'>Connectez-vous pour continuer...</h2>
        <div class='auth__form'>
            <div class='auth__status' v-if='isUserConnected !== false'>✅ Redirection dans quelques instants...</div>
            <div class='auth__status' v-else-if="requestStatus === 'success'">✅ Vous êtes connecté(e), redirection dans quelques instants...</div>
            <div class='auth__status' v-else-if="requestStatus === 'failure'">❌ Informations incorrectes.</div>
            <div class='auth__inputs'>
                <input class='auth__input' v-model='email' placeholder='Adresse électronique'>
                <input class='auth__input' type='password' v-model='password' placeholder='Mot de passe'>
            </div>
            <a class='btn btn-success' v-on:click='login' type='button'>Se connecter</a>
        </div>
    </div>
</template>

<script>
    import globalMixins from '@/mixins/global'

    export default {
        data: function () {
            return {
                email: null,
                password: null,
                requestStatus: null
            }
        },
        created: function () {
            if (this.isUserConnected !== false) {
                // Redirection.
                setTimeout(() => {  window.location.href = '/home' }, 2000)
            }
        },
        mixins: [globalMixins],
        methods: {
            login() {
                // Déclaration des variables.
                const email = this.email,
                password = this.password

                // Vérification des variables.
                const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                if ((!email || !emailRegex.test(String(email).toLowerCase()) || email.length > 50) ||
                    (!password || typeof password !== 'string' || password.length > 100 || password.length < 10)) {
                    return this.requestStatus = 'failure'
                }

                // Utilisation de l'API.
                const requestOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: email, password: password  })
                };
                fetch('http://localhost:3000/api/auth/login', requestOptions).then(response => response.json())
                    .then(data => {
                        if (!data.error) {
                            // Nettoyage du formulaire.
                            this.email = null
                            this.password = null
                            
                            // Enregistrement de la session localement.
                            localStorage.setItem('userId', JSON.stringify(data.userId));
                            localStorage.setItem('token', JSON.stringify(data.token));

                            // Redirection.
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