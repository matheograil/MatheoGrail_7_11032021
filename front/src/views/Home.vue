<template>
    <div class='home'>
        <h2 class='home__title'>Bienvenue,</h2>
        <h3 class='home__title'>Commencez par publier un message !</h3>
        <div class='form'>
            <div class='form__status' v-if="requestStatus === 'success'">✅ Message publié !</div>
            <div class='form__status' v-else-if="requestStatus === 'failure'">❌ Informations incorrectes.</div>
            <div class='form__inputs'>
                <textarea class='form__input' v-model='content' placeholder='Message public' rows='10'></textarea>
                <input type='file' id='file' accept='image/png, image/jpeg, image/jpg' v-on:change='processImage($event)'>
            </div>
            <a class='btn btn-success' v-on:click='publish'>Publier</a>
        </div>
        <h3 class='home__title' v-if='messages && messages.length > 0' >Voici les derniers messages publiés :</h3>
        <div class='messages' v-for='message in messages' v-bind:key='message.id'>
            <div class='messages__content'>
                <div class='messages__more'>Publié par <strong>{{ message.userId }}</strong> le {{ message.timestamp }} →</div>
                {{ message.content }}
                <img class='messages__img' v-if='message.imageUrl' v-bind:src='message.imageUrl'/>
                <a class='btn btn-primary' v-bind:href='message.url'>Afficher la discussion</a>
            </div>
        </div>
    </div>
</template>

<script>
    import globalMixins from '../mixins/Global'

    export default {
        data: function () {
            return {
                content: null,
                requestStatus: null,
                messages: null
            }
        },
        mixins: [globalMixins],
        created: function () {
            // On vérifie que l'utilisateur est connecté.
            if (this.isUserConnected() === false) {
                this.$router.push('/')
            }
            // Récupération des messages.
            this.getMessages()
        },
        methods: {
            // Retourne tous les messages.
            getMessages() {
                const requestOptions = {
                    method: 'GET',
                    headers: { 'authorization_token': this.authorizationToken, 'user_id': this.userId }
                }
                fetch('http://localhost:3000/api/messages', requestOptions).then(response => response.json())
                    .then(messages => {
                        if (!messages.error) {
                            let i
                            for (i in messages) {
                                messages[i].timestamp = this.timeConverter(messages[i].timestamp)
                                messages[i].url = `/messages/${messages[i].id}`
                                this.getUserData(messages[i].userId).then((user) => {
                                    messages[i].userId = user.firstName + ' ' + user.lastName
                                })
                            }
                            return this.messages = messages
                        }
                        this.logout()
                    }).catch(() => {
                        this.logout()
                    })
            },
            // Publication d'un message.
            publish() {
                const content = this.content
                if (!content || typeof content !== 'string' || content.length > 3000) {
                    return this.requestStatus = 'failure'
                } else if (this.image) {
                    if (this.image.size > 5000000 || (this.image.type !== 'image/jpeg' && this.image.type !== 'image/jpg' && this.image.type !== 'image/png')) {
                        return this.requestStatus = 'failure'
                    }
                }
                let requestOptions
                if (this.image) {
                    const formData = new FormData()
                    formData.append('image', this.image)
                    formData.append('content', content)
                    requestOptions = {
                        method: 'POST',
                        headers: { 'authorization_token': this.authorizationToken, 'user_id': this.userId },
                        body: formData
                    }
                } else {
                    requestOptions = {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'authorization_token': this.authorizationToken, 'user_id': this.userId },
                        body: JSON.stringify({ content: content })
                    }
                }
                fetch('http://localhost:3000/api/messages', requestOptions).then(response => {
                    if (response.status === 200) {
                        this.content = null
                        if (this.image) {
                            document.getElementById('file').value = null
                        }
                        this.getMessages()
                        return this.requestStatus = 'success'
                    }
                    this.requestStatus = 'failure'
                }).catch(() => {
                    this.requestStatus = 'failure'
                })
            },
            processImage(event) {
                this.image = event.target.files[0]
            }
        }
    }
</script>
