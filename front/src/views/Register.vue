<template>
    <div class="auth">
        <h2 class="auth__title">Vous pouvez aussi vous inscrire !</h2>
        <div class="auth__form">
            <div class="auth__inputs">
                <input class="auth__input" type="text" name="firstName" id="firstName" placeholder="Prénom">
                <input class="auth__input" type="text" name="lastName" id="lastName" placeholder="Nom">
                <input class="auth__input" type="email" name="email" id="email" placeholder="Adresse électronique">
                <input class="auth__input" type="password" name="password" id="password" placeholder="Mot de passe">
                <input class="auth__input" type="password" name="passwordConfirmation" id="passwordConfirmation" placeholder="Mot de passe">
            </div>
        </div>
        <a class="auth__go" type="button">S'inscrire</a>
    </div>
</template>

<style lang="scss">
    @import "../styles/auth.scss";
</style>
