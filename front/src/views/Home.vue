<template>
    <div class='home'>
        <h2 class='home__title'>Page en cours de développement...</h2>
    </div>
</template>

<script>
    import globalMixins from '../mixins/Global'

    export default {
        mixins: [globalMixins],
        created: function () {
            // On vérifie que l'utilisateur est connecté.
            if (this.isUserConnected === false) {
                // Redirection.
                window.location.href = '/'
            }
        }
    }
</script>
