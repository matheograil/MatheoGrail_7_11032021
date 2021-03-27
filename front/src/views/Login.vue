<template>
    <div class="auth">
        <h2 class="auth__title">Connectez-vous pour continuer...</h2>
        <div class="auth__form">
            <div class="auth__inputs">
                <input class="auth__input" type="email" name="email" id="email" placeholder="Adresse électronique">
                <input class="auth__input" type="password" name="password" id="password" placeholder="Mot de passe">
            </div>
        </div>
        <a class="auth__go" type="button">Se connecter</a>
    </div>
</template>

<style lang="scss">
    @import "../styles/auth.scss"
</style>