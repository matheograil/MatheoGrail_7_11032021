<template>
    <div id="app">
        <div class="app__header">
            <h1>Groupomania</h1>
            <div class="app__nav">
                <router-link to="/">Connexion</router-link> •
                <router-link to="/register">Inscription</router-link>
            </div>
        </div>
        <router-view/>
    </div>
</template>

<style lang="scss">
    #app {
        margin: auto;
        max-width: 1300px;
        font-family: Helvetica;
        text-align: center;
        color: #2c3e50;

        .app__header {
            display: flex;
            align-items: baseline;
            justify-content: center;
            padding: 20px;

            h1 {
                padding: 10px;
            }

            @media screen and (max-width: 500px) {
                flex-wrap: wrap;
            }

            .app__nav {
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
