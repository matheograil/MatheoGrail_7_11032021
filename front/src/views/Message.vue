<template>
    <div class='message'>
        <h2 class='message__title'>Message</h2>
        <h3 class='message__title'>Voici le message sélectionné :</h3>
        <div class='messages'>
            <div class='messages__content'>
                <div class='messages__more'>Publié par <strong>{{ author }}</strong> le {{ timestamp }} →</div>
                {{ content }}
                <img class='messages__img' v-if='imageUrl' v-bind:src='imageUrl'/>
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
                imageUrl: null
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
                        this.getUserData(message.userId).then((user) => {
                            this.author = user.firstName + ' ' + user.lastName
                        })
                        this.timestamp = this.timeConverter(message.timestamp)
                        this.content = message.content
                        this.imageUrl = message.imageUrl
                    } else {
                        this.logout()
                    }
                }).catch(() => {
                    this.logout()
                })
        }
    }
</script>
