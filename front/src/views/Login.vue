<template>
    <div class="login">
        <h2 class="login__title">Connectez-vous pour continuer...</h2>
        <div class="login__form">
            <div class="login__inputs">
                <input class="login__input" type="email" name="email" id="email" placeholder="Adresse électronique">
                <input class="login__input" type="password" name="password" id="password" placeholder="Mot de passe">
            </div>
        </div>
        <a class="login__go" type="button">Se connecter</a>
    </div>
</template>

<style lang="scss">
    .login {
        .login__go {
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

        .login__form {
            display: flex;
            justify-content: center;

            .login__inputs {
                margin-top: 10px;
                width: 400px;

                .login__input {
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

                .login__input::placeholder {
                    color: #2c3e50;
                    opacity: 1;
                }
            }
        }
    }
</style>