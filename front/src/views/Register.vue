<template>
    <div class="register">
        <h2 class="login__title">Vous pouvez aussi vous inscrire !</h2>
        <div class="register__form">
            <div class="register__inputs">
                <input class="register__input" type="text" name="firstName" id="firstName" placeholder="Prénom">
                <input class="register__input" type="text" name="lastName" id="lastName" placeholder="Nom">
                <input class="register__input" type="email" name="email" id="email" placeholder="Adresse électronique">
                <input class="register__input" type="password" name="password" id="password" placeholder="Mot de passe">
                <input class="register__input" type="password" name="passwordConfirmation" id="passwordConfirmation" placeholder="Mot de passe">
            </div>
        </div>
        <a class="register__go" type="button">S'inscrire</a>
    </div>
</template>

<style lang="scss">
    .register {
        .register__go {
            margin-top: 5px;
            background-color: #4CAF50;
            color: white;
            padding: 15px 32px;
            display: inline-block;
            font-size: 16px;
            border-radius: 10px;
            font-weight: bold;
            cursor:pointer;
        }

        .register__form {
            display: flex;
            justify-content: center;

            .register__inputs {
                margin-top: 10px;
                width: 400px;

                .register__input {
                    outline-style: none;
                    margin: 5px;
                    width: calc(100% - 20px);
                    -webkit-appearance: none;
                    padding: 15px;
                    border: 1px solid #2c3e50;
                    border-radius: 20px;
                    font-size: 15px;
                    font-family: Helvetica;
                    box-sizing: border-box;
                }

                .register__input::placeholder {
                    color: #2c3e50;
                    opacity: 1;
                }
            }
        }
    }
</style>
