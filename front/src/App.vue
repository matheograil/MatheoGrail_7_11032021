<template>
    <div id='app'>
        <div class='header'>
            <h1 class='header__title'>Groupomania</h1>
            <div class='header__nav'>
                <router-link to='/'>Connexion</router-link> •
                <router-link to='/register'>Inscription</router-link>
            </div>
        </div>
        <router-view/>
    </div>
</template>

<style lang='scss'>
    #app {
        margin: auto;
        max-width: 1300px;
        font-family: Helvetica;
        text-align: center;
        color: #2c3e50;

        .header {
            display: flex;
            align-items: baseline;
            justify-content: center;
            padding: 20px;

            .header__title {
                padding: 10px;
            }

            @media screen and (max-width: 500px) {
                flex-wrap: wrap;
            }

            .header__nav {
                padding: 10px;

                a {
                    font-weight: bold;
                    
                    &.router-link-exact-active {
                        color: #42b983;
                    }
                }
            }
        }
    }
</style>
