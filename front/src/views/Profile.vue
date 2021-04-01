<template>
    <div class='profile'>
        <h2 class='profile__title'>Profil public</h2>
        <h3 class='profile__title'>{{ getUserData.firstName }} {{ getUserData.lastName }}</h3>
        <img src='../../public/profile.png'>
        <p class='profile__title'><strong>Adresse électronique →</strong> {{ getUserData.email }}</p>
        <p class='profile__title' v-if='description'><strong>Description →</strong> {{ getUserData.description }}</p>
        <p class='profile__title'><strong>Type de compte →</strong> {{ getUserData.isAdmin }}</p>
        <p class='profile__title'><strong>État du compte →</strong> {{ getUserData.isDisabled }}</p>
    </div>
</template>

<script>
    import globalMixins from '../mixins/Global'

    export default {
        data: function () {
            return {
                getUserData: {
                    firstName: null,
                    lastName: null,
                    email: null,
                    description: null,
                    isAdmin: null,
                    isDisabled: null
                },
            }
        },
        mixins: [globalMixins],
        created: function () {
            // On vérifie que l'utilisateur est connecté.
            if (this.isUserConnected === false) {
                // Redirection.
                window.location.href = '/'
            }

            // Récupération des informations.
            this.getUserDataFunction(this.$route.params.id)
        }
    }
</script>
