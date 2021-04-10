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
            if (this.isUserConnected() === false) {
                this.$router.push('/')
            }
            // Récupération des informations.
            this.getUserData(this.$route.params.id).then(user => {
                this.firstName = user.firstName
                this.lastName = user.lastName
                this.email = user.email
                this.description = user.description
                if (user.isAdmin === 1) {
                    this.isAdmin = 'Administrateur'
                } else {
                    this.isAdmin = 'Utilisateur'
                }
                if (user.isDisabled === 1) {
                    this.isDisabled = 'Désactivé'
                } else {
                    this.isDisabled = 'Activé'
                }
            })
        }
    }
</script>
