<template>
    <div class='account'>
        <h2 class='account__title'>Mon compte </h2>
        <h3 class='account__title'>Mes informations personnelles</h3>
        <div class='form'>
            <div class='form__inputs'>
                <input disabled class='form__input' v-model='firstName'>
                <input disabled class='form__input' v-model='lastName'>
                <input disabled class='form__input' v-model='email'>
            </div>
        </div>
        <h3 class='account__title'>Modifier mes informations</h3>
        <div class='form'>
            <div class='form__status' v-if="requestStatus === 'success'">✅ Informations modifiées !</div>
            <div class='form__status' v-else-if="requestStatus === 'failure'">❌ Informations incorrectes.</div>
            <div class='form__inputs'>
                <input class='form__input' v-model='description' placeholder='Description publique'>
                <input class='form__input' type='password' v-model='newPassword' placeholder='Nouveau mot de passe (champ optionnel)'>
                <input class='form__input' type='password' v-model='password' placeholder='Mot de passe'>
            </div>
            <a class='btn btn-success' v-on:click='edit'>Enregistrer</a>
            <a class='btn btn-error' v-on:click='disable'>Désactiver mon compte</a>
        </div>
    </div>
</template>

<script>
    import globalMixins from '../mixins/Global'

    const authorizationToken = localStorage.getItem('authorizationToken'),
    userId = localStorage.getItem('userId')

    export default {
        data: function () {
            return {
                firstName: null,
                lastName: null,
                email: null,
                description: null,
                password: null,
                newPassword: null,
                requestStatus: null
            }
        },
        mixins: [globalMixins],
        created: function () {
            // On vérifie que l'utilisateur est connecté.
            if (this.isUserConnected === false) {
                // Redirection.
                window.location.href = '/'
            }

            // Récupération des informations personnelles.
            this.getUserData(userId)
        },
        methods: {
            edit() {
                // Déclaration des variables.
                const description = this.description,
                password = this.password,
                newPassword = this.newPassword

                // Vérification des variables.
                if ((!description || typeof description !== 'string' || description.length > 200) ||
                    (!password || typeof password !== 'string' || password.length > 100 || password.length < 10)) {
                    return this.requestStatus = 'failure'
                } else if (newPassword) {
                    if (typeof newPassword !== 'string' || newPassword.length > 100 || newPassword.length < 10) {
                        return this.requestStatus = 'failure'
                    }
                }

                // Utilisation de l'API.
                let requestOptions
                if (newPassword) {
                    requestOptions = {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json', 'authorization_token': authorizationToken, 'user_id': userId },
                        body: JSON.stringify({ description: description, password: password, newPassword: newPassword  })
                    }
                } else {
                    requestOptions = {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json', 'authorization_token': authorizationToken, 'user_id': userId },
                        body: JSON.stringify({ description: description, password: password })
                    }
                }
                fetch('http://localhost:3000/api/accounts/me', requestOptions).then(response => {
                    if (response.status === 200) {
                        // Nettoyage du formulaire.
                        this.password = null
                        this.newPassword = null
                        
                        return this.requestStatus = 'success'
                    }
                    this.requestStatus = 'failure'
                }).catch(() => {
                    this.requestStatus = 'failure'
                })
            },
            disable() {
                // Déclaration des variables.
                const password = this.password

                // Vérification des variables.
                if (!password || typeof password !== 'string' || password.length > 100 || password.length < 10) {
                    return this.requestStatus = 'failure'
                }

                // Utilisation de l'API.
                const requestOptions = {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json', 'authorization_token': authorizationToken, 'user_id': userId },
                    body: JSON.stringify({ password: password })
                }
                fetch('http://localhost:3000/api/accounts/me', requestOptions).then(response => {
                    if (response.status === 200) {
                        // Déconnexion et redirection.
                        return this.logout()
                    }
                    this.requestStatus = 'failure'
                }).catch(() => {
                    this.requestStatus = 'failure'
                })
            }
        }
    }
</script>
