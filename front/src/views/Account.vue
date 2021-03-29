<template>
    <div class='account'>
        <h2 class='account__title'>Mon compte</h2>
        <h3 class='account__title'>Mes informations personnelles</h3>
        <div class='form'>
            <div class='form__inputs'>
                <input disabled class='form__input' :value='firstName'>
                <input disabled class='form__input' :value='lastName'>
                <input disabled class='form__input' :value='email'>
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
            <a class='btn btn-success' v-on:click='edit' type='button'>Enregistrer</a>
        </div>
        <h3 class='account__title'>Désactiver mon compte</h3>
        <div class='form'>
            <div class='form__inputs'>
                <input class='form__input' type='password' placeholder='Mot de passe'>
            </div>
            <a class='btn btn-error' type='button'>Désactiver</a>
        </div>
    </div>
</template>

<script>
    import globalMixins from '../mixins/Global'

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

            // Utilisation de l'API afin d'afficher les informations personnelles.
            const requestOptions = {
                method: 'GET',
                headers: { 'authorization_token': localStorage.getItem('authorizationToken'), 'user_id': localStorage.getItem('userId') }
            }
            fetch(`http://localhost:3000/api/accounts/details/${localStorage.getItem('userId')}`, requestOptions).then(response => response.json())
                .then(data => {
                    if (!data.error) {
                        // Modification des variables.
                        this.firstName = data.firstName
                        this.lastName = data.lastName
                        this.email = data.email
                    }
                    console.log('Erreur lors de la récupération des données.')
                }).catch(() => {
                    console.log('Erreur lors de la récupération des données.')
                })
        },
        methods: {
            edit() {
                // Déclaration des variables.
                const description = this.description,
                password = this.password,
                newPassword = this.newPassword

                // Vérification des variables.
                if ((!description || typeof description !== 'string' || description.length <= 200) ||
                    (!password || typeof password !== 'string' || password.length >= 100 || password.length <= 10)) {
                    return this.requestStatus = 'failure'
                }

                // Utilisation de l'API.
                const requestOptions = {
                    method: 'DELETE',
                    headers: { 'authorization_token': localStorage.getItem('authorizationToken'), 'user_id': localStorage.getItem('userId') }
                }
                fetch('http://localhost:3000/api/accounts/me', requestOptions).then(response => {
                    if (response.status === 200) {
                        // Nettoyage du formulaire.
                        this.description = null
                        this.password = null
                        this.newPassword = null
                        
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
