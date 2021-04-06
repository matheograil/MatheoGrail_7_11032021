<template>
    <div class='message'>
        <h2 class='message__title'>Message</h2>
        <h3 class='message__title'>Voici le message sélectionné :</h3>
        <div class='messages'>
            <div class='messages__content'>
                <div class='messages__more'>Publié par <strong>{{ author }}</strong> le {{ timestamp }} →</div>
                {{ content }}
                <img class='messages__img' v-if='imageUrl' v-bind:src='imageUrl'/>
                <a class='btn btn-error' v-if='authorId == this.userId || isAdmin' v-on:click='remove'>Supprimer</a>
            </div>
        </div>
    </div>
</template>

<script>
    import globalMixins from '../mixins/Global'

    export default {
        data: function () {
            return {
                author: null,
                timestamp: null,
                content: null,
                imageUrl: null,
                authorId: null,
                isAdmin: null
            }
        },
        mixins: [globalMixins],
        created: function () {
            // On vérifie que l'utilisateur est connecté.
            if (this.isUserConnected() === false) {
                this.$router.push('/')
            }
            // Récupération du message.
            const requestOptions = {
                method: 'GET',
                headers: { 'authorization_token': this.authorizationToken, 'user_id': this.userId }
            }
            fetch(`http://localhost:3000/api/messages/${this.$route.params.id}`, requestOptions).then(response => response.json())
                .then(message => {
                    if (!message.error) {
                        this.getUserData(message.userId).then(user => {
                            this.author = user.firstName + ' ' + user.lastName
                        })
                        this.authorId = 1
                        this.timestamp = this.timeConverter(message.timestamp)
                        this.content = message.content
                        this.imageUrl = message.imageUrl
                    } else {
                        this.logout()
                    }
                }).catch(() => {
                    this.logout()
                })
            // On détermine si l'utilisateur est administrateur.
            this.getUserData(this.userId).then(user => {
                if (user.isAdmin === 1) {
                    this.isAdmin = 1
                }
            }).catch(() => {
                this.logout()
            })
        },
        methods: {
            // Suppression du message et de ses commentaires.
            remove() {
                const requestOptions = {
                    method: 'DELETE',
                    headers: { 'authorization_token': this.authorizationToken, 'user_id': this.userId }
                }
                fetch(`http://localhost:3000/api/messages/${this.$route.params.id}`, requestOptions).then(response => {
                    if (response.status === 200) {
                        return this.$router.push('/home')
                    }
                    this.logout()
                }).catch(() => {
                    this.logout()
                })
            }
        }
    }
</script>
