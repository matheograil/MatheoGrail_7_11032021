<template>
    <div class='account'>
        <h2 class='account__title'>Mon compte</h2>
        <h3 class='account__title'>Mes informations personnelles</h3>
        <div class='form'>
            <div class='form__inputs'>
                <input disabled class='form__input' value='Mathéo'>
                <input disabled class='form__input' value='Grail'>
                <input disabled class='form__input' value='matheo.grail@yahoo.fr'>
            </div>
        </div>
        <h3 class='account__title'>Modifier ses informations</h3>
        <div class='form'>
            <div class='form__inputs'>
                <input class='form__input' placeholder='Description publique'>
                <input class='form__input' type='password' placeholder='Nouveau mot de passe (champ optionnel)'>
                <input class='form__input' type='password' placeholder='Mot de passe'>
            </div>
            <a class='btn btn-success' type='button'>Enregistrer</a>
        </div>
        <h3 class='account__title'>Désactiver son compte</h3>
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
        mixins: [globalMixins],
        created: function () {
            if (this.isUserConnected === false) {
                // Redirection.
                window.location.href = '/'
            }
        }
    }
</script>
