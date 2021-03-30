<template>
    <div class='profile'>
        <h2 class='profile__title'>Profil public</h2>
        <h3 class='profile__title'>{{ firstName }} {{ lastName }}</h3>
        <img src='../../public/profile.png'>
        <p class='profile__title'><strong>Adresse électronique →</strong> {{ email }}</p>
        <p class='profile__title' v-if='description'><strong>Description →</strong> {{ description }}</p>
        <p class='profile__title'><strong>Type de compte →</strong> {{ isAdmin }}</p>
        <p class='profile__title'><strong>État du compte →</strong> {{ isDisabled }}</p>
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
                isAdmin: null,
                isDisabled: null
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
                headers: { 'authorization_token': authorizationToken, 'user_id': userId }
            }
            fetch(`http://localhost:3000/api/accounts/details/${this.$route.params.id}`, requestOptions).then(response => response.json())
                .then(data => {
                    if (!data.error) {
                        // Modification des variables.
                        this.firstName = data.firstName
                        this.lastName = data.lastName
                        this.email = data.email
                        this.description = data.description
                        if (this.isAdmin === 1) {
                            this.isAdmin = 'Administrateur'
                        } else {
                            this.isAdmin = 'Utilisateur'
                        }
                        if (this.isDisabled === 1) {
                            this.isDisabled = 'Désactivé'
                        } else {
                            this.isDisabled = 'Activé'
                        }
                    } else {
                        console.log('Erreur lors de la récupération des données.')
                    }
                }).catch(() => {
                    console.log('Erreur lors de la récupération des données.')
                })
        }
    }
</script>
