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
                <div class='messages__more'>Publié par <strong><a v-bind:href='message.profileUrl'>{{ message.author }}</a></strong> le {{ message.date }} →</div>
                {{ message.content }}
                <img class='messages__img' v-if='message.imageUrl' v-bind:src='message.imageUrl'/>
                <a class='btn btn-primary' v-bind:href='message.messageUrl'>Afficher la discussion</a>
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
                return this.$router.push('/')
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
                            return this.loopUserData(messages).then(messages => {
                                this.messages = messages
                            })
                        }
                        console.log("Une erreur s'est produite.")
                    })
            },
            // Publication d'un message.
            publish() {
                const content = this.content,
                image = this.image
                if (!content || typeof content !== 'string' || content.length > 3000) {
                    return this.requestStatus = 'failure'
                } else if (image) {
                    if (image.size > 5000000 || (image.type !== 'image/jpeg' && image.type !== 'image/jpg' && image.type !== 'image/png')) {
                        return this.requestStatus = 'failure'
                    }
                }
                let requestOptions
                if (image) {
                    const formData = new FormData()
                    formData.append('image', image)
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
                        if (image) {
                            document.getElementById('file').value = null
                        }
                        this.getMessages()
                        return this.requestStatus = 'success'
                    }
                    this.requestStatus = 'failure'
                })
            }
        }
    }
</script>
