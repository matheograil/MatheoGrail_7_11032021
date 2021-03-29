<template>
    <div class='home'>
        <h2 class='home__title'>Ceci est un accès réservé aux utilisateurs connectés.</h2>
    </div>
</template>

<script>
    import globalMixins from '../mixins/Global'

    export default {
        mixins: [globalMixins],
        created: function () {
            if (this.isUserConnected === false) {
                // Redirection.
                window.location.href = '/'
            }
        }
    }
</script>
