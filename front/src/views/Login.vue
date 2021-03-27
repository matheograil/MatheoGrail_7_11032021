<template>
    <div class="login">
        <AuthMessage msg="Connectez-vous pour continuer..."/>
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
                    margin: 5px;
                    width: 100%;
                    -webkit-appearance: none;
                    padding: 15px;
                    border: 2px solid #42b983;
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

<script>
    import AuthMessage from '@/components/AuthMessage.vue'

    export default {
        name: 'Login',
        components: {
            AuthMessage
        }
    }
</script>
